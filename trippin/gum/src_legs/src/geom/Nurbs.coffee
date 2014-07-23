#<< geom/Vec4
#<< geom/Vec3

class geom.Nurbs

	#
	#	Finds knot vector span.
	#
	#	p : degree
	#	u : parametric value
	#	U : knot vector
	#	
	#	returns the span
	#	
	@findSpan: (p, u, U) ->
		n = U.length - p - 1
		return n - 1  if u >= U[n]
		return p  if u <= U[p]
		low = p
		high = n
		mid = Math.floor((low + high) / 2)
		while u < U[mid] or u >= U[mid + 1]
			if u < U[mid]
				high = mid
			else
				low = mid
			mid = Math.floor((low + high) / 2)
		mid

	
	#
	#	Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
	#   
	#	span : span in which u lies
	#	u    : parametric point
	#	p    : degree
	#	U    : knot vector
	#	
	#	returns array[p+1] with basis functions values.
	#	
	@calcBasisFunctions: (span, u, p, U) ->
		N = []
		left = []
		right = []
		N[0] = 1.0
		j = 1

		while j <= p
			left[j] = u - U[span + 1 - j]
			right[j] = U[span + j] - u
			saved = 0.0
			r = 0

			while r < j
				rv = right[r + 1]
				lv = left[j - r]
				temp = N[r] / (rv + lv)
				N[r] = saved + rv * temp
				saved = lv * temp
				++r
			N[j] = saved
			++j
		N

	
	#
	#	Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.
	# 
	#	p : degree of B-Spline
	#	U : knot vector
	#	P : control points (x, y, z, w)
	#	u : parametric point
	#
	#	returns point for given u
	#	
	@calcBSplinePoint: (p, U, P, u) ->
		span = @findSpan(p, u, U)
		N = @calcBasisFunctions(span, u, p, U)
		C = new geom.Vec4(0, 0, 0, 0)
		j = 0

		while j <= p
			point = P[span - p + j]
			Nj = N[j]
			wNj = point.w * Nj
			C.x += point.x * wNj
			C.y += point.y * wNj
			C.z += point.z * wNj
			C.w += point.w * Nj
			++j
		C

	
	#
	#	Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.
	#
	#	span : span in which u lies
	#	u    : parametric point
	#	p    : degree
	#	n    : number of derivatives to calculate
	#	U    : knot vector
	#
	#	returns array[n+1][p+1] with basis functions derivatives
	#	
	@calcBasisFunctionDerivatives: (span, u, p, n, U) ->
		zeroArr = []
		i = 0

		while i <= p
			zeroArr[i] = 0.0
			++i
		ders = []
		i = 0

		while i <= n
			ders[i] = zeroArr.slice(0)
			++i
		ndu = []
		i = 0

		while i <= p
			ndu[i] = zeroArr.slice(0)
			++i
		ndu[0][0] = 1.0
		left = zeroArr.slice(0)
		right = zeroArr.slice(0)
		j = 1

		while j <= p
			left[j] = u - U[span + 1 - j]
			right[j] = U[span + j] - u
			saved = 0.0
			r = 0

			while r < j
				rv = right[r + 1]
				lv = left[j - r]
				ndu[j][r] = rv + lv
				temp = ndu[r][j - 1] / ndu[j][r]
				ndu[r][j] = saved + rv * temp
				saved = lv * temp
				++r
			ndu[j][j] = saved
			++j
		j = 0

		while j <= p
			ders[0][j] = ndu[j][p]
			++j
		r = 0

		while r <= p
			s1 = 0
			s2 = 1
			a = []
			i = 0

			while i <= p
				a[i] = zeroArr.slice(0)
				++i
			a[0][0] = 1.0
			k = 1

			while k <= n
				d = 0.0
				rk = r - k
				pk = p - k
				if r >= k
					a[s2][0] = a[s1][0] / ndu[pk + 1][rk]
					d = a[s2][0] * ndu[rk][pk]
				j1 = (if (rk >= -1) then 1 else -rk)
				j2 = (if (r - 1 <= pk) then k - 1 else p - r)
				j = j1

				while j <= j2
					a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j]
					d += a[s2][j] * ndu[rk + j][pk]
					++j
				if r <= pk
					a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r]
					d += a[s2][k] * ndu[r][pk]
				ders[k][r] = d
				j = s1
				s1 = s2
				s2 = j
				++k
			++r
		r = p
		k = 1

		while k <= n
			j = 0

			while j <= p
				ders[k][j] *= r
				++j
			r *= p - k
			++k
		ders

	
	#
	#	Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.
	#
	#	p  : degree
	#	U  : knot vector
	#	P  : control points
	#	u  : Parametric points
	#	nd : number of derivatives
	#
	#	returns array[d+1] with derivatives
	#	
	@calcBSplineDerivatives: (p, U, P, u, nd) ->
		du = (if nd < p then nd else p)
		CK = []
		span = @findSpan(p, u, U)
		nders = @calcBasisFunctionDerivatives(span, u, p, du, U)
		Pw = []
		i = 0

		while i < P.length
			point = P[i].clone()
			w = point.w
			point.x *= w
			point.y *= w
			point.z *= w
			Pw[i] = point
			++i
		k = 0

		while k <= du
			point = Pw[span - p].clone().multiplyScalar(nders[k][0])
			j = 1

			while j <= p
				point.add Pw[span - p + j].clone().multiplyScalar(nders[k][j])
				++j
			CK[k] = point
			++k
		k = du + 1

		while k <= nd + 1
			CK[k] = new THREE.Vector4(0, 0, 0)
			++k
		CK

	
	#
	#	Calculate "K over I"
	#
	#	returns k!/(i!(k-i)!)
	#	
	calcKoverI: (k, i) ->
		nom = 1
		j = 2

		while j <= k
			nom *= j
			++j
		denom = 1
		j = 2

		while j <= i
			denom *= j
			++j
		j = 2

		while j <= k - i
			denom *= j
			++j
		nom / denom

	
	#
	#	Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.
	#
	#	Pders : result of function calcBSplineDerivatives
	#
	#	returns array with derivatives for rational curve.
	#	
	@calcRationalCurveDerivatives: (Pders) ->
		nd = Pders.length
		Aders = []
		wders = []
		i = 0

		while i < nd
			point = Pders[i]
			Aders[i] = new geom.Vec3(point.x, point.y, point.z)
			wders[i] = point.w
			++i
		CK = []
		k = 0

		while k < nd
			v = Aders[k].clone()
			i = 1

			while i <= k
				v.sub CK[k - i].clone().multiplyScalar(@calcKoverI(k, i) * wders[i])
				++i
			CK[k] = v.divideScalar(wders[0])
			++k
		CK

	
	#
	#	Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.
	#
	#	p  : degree
	#	U  : knot vector
	#	P  : control points in homogeneous space
	#	u  : parametric points
	#	nd : number of derivatives
	#
	#	returns array with derivatives.
	#	
	@calcNURBSDerivatives: (p, U, P, u, nd) ->
		Pders = @calcBSplineDerivatives(p, U, P, u, nd)
		@calcRationalCurveDerivatives Pders

	
	#
	#	Calculate rational B-Spline surface point. See The NURBS Book, page 134, algorithm A4.3.
	# 
	#	p1, p2 : degrees of B-Spline surface
	#	U1, U2 : knot vectors
	#	P      : control points (x, y, z, w)
	#	u, v   : parametric values
	#
	#	returns point for given (u, v)
	#	
	@calcSurfacePoint: (p, q, U, V, P, u, v) ->
		uspan = @findSpan(p, u, U)
		vspan = @findSpan(q, v, V)
		Nu = @calcBasisFunctions(uspan, u, p, U)
		Nv = @calcBasisFunctions(vspan, v, q, V)
		temp = []
		l = 0

		while l <= q
			temp[l] = new geom.Vec4(0, 0, 0, 0)
			k = 0

			while k <= p
				point = P[uspan - p + k][vspan - q + l].clone()
				w = point.w
				point.x *= w
				point.y *= w
				point.z *= w
				temp[l].add point.multiplyScalar(Nu[k])
				++k
			++l
		Sw = new geom.Vec4(0, 0, 0, 0)
		l = 0

		while l <= q
			Sw.add temp[l].multiplyScalar(Nv[l])
			++l
		Sw.divideScalar Sw.w
		new geom.Vec4(Sw.x, Sw.y, Sw.z)