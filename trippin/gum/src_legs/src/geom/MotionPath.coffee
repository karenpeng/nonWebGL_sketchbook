#<< util/General

class geom.MotionPath

	numSteps: 12
	debug: true
	debugColor: new paper.Color(1,1,1,0.2)
	debugHighlightColor: "#999"

	subPoints: null
	circles: null

	activeDrag: null
	pathFrame: 0
	id: -1

	@idIncrement: 0

	constructor: (@centerPoint) ->
		@points = []
		@handles = []
		@subPoints = []

		SkeletonScene.events.addEventListener "toggleMotionPaths", () => @visible = SkeletonScene.instance.options.showMotionPaths


		if @centerPoint
			@id = (geom.MotionPath.idIncrement++)
			@init() 
		@

	load: (data) ->
		@id = data.id
		for p in data.points
			@addHandle(p.x,p.y)
		@createSubPoints()
		@


	addHandle: (x,y) ->
		p = new Vec2(x,y)
		@points.push p

		circ = new paper.Path.Circle(new paper.Point(p.x,p.y),8)
		circ.fillColor = @debugColor
		circ.linkedPoint = p
		circ.target = @
		circ.isDraggable = true
		circ.eMouseMove = 	@onMoveHandle
		circ.visible = SkeletonScene.instance.options.showMotionPaths
		@handles.push circ

	init: ->
		numPoints = 4
		maxAngle = Math.PI * 2 / 8
		minAngle = maxAngle * 0.7
		angle = 0
		maxR = 100
		minR = 50
		i = 0

		while i < numPoints
			angle += minAngle + Math.random() * (maxAngle - minAngle)
			ry = minR + Math.random() * (maxR - minR)
			rx = ry * 1.2
			@addHandle(@centerPoint.x + rx * Math.cos(angle), @centerPoint.y + ry * Math.sin(angle))
			i++

		@createSubPoints()

	createSubPoints: ->
		i = 0
		while i < @points.length
			p0 = @points[i]
			p1 = @points[(i + 1) % @points.length]
			p2 = @points[(i + 2) % @points.length]
			p3 = @points[(i + 3) % @points.length]
			t = 0

			while t < 1
				p = Vec2.create(0, 0, 0)
				@calculatePoint(p,p0,p1,p2,p3,t)
				@subPoints.push p
				t += 1 / @numSteps
			i++

		if @debug
			@subPointCircles = []
			i = 0
			while i < @subPoints.length
				p = @subPoints[i]
				c = new paper.Path.Circle(new paper.Point(p.x,p.y),2)
				c.fillColor = @debugColor
				c.linkedPoint = @subPoints[i]
				c.visible = SkeletonScene.instance.options.showMotionPaths
				@subPointCircles.push c
				i++
			for c in @handles
				c.bringToFront()


	recalculate: ->
		i = 0
		j = 0
		while i < @points.length
			p0 = @points[i]
			p1 = @points[(i + 1) % @points.length]
			p2 = @points[(i + 2) % @points.length]
			p3 = @points[(i + 3) % @points.length]
			t = 0
			while t < 1
				p = @subPoints[j]
				@calculatePoint(p,p0,p1,p2,p3,t)
				t += 1 / @numSteps
				j++
			i++
		if @debug
			i = 0
			while i < @subPointCircles.length
				@subPointCircles[i].position.x = @subPoints[i].x
				@subPointCircles[i].position.y = @subPoints[i].y
				i++

	calculatePoint: (p, p0, p1, p2, p3, t) ->
		p.x = p0.x * 1 / 6 * (1 - 3 * t + 3 * t * t - t * t * t) + p1.x * 1 / 6 * (4 - 6 * t * t + 3 * t * t * t) + p2.x * 1 / 6 * (1 + 3 * t + 3 * t * t - 3 * t * t * t) + p3.x * 1 / 6 * (t * t * t)
		p.y = p0.y * 1 / 6 * (1 - 3 * t + 3 * t * t - t * t * t) + p1.y * 1 / 6 * (4 - 6 * t * t + 3 * t * t * t) + p2.y * 1 / 6 * (1 + 3 * t + 3 * t * t - 3 * t * t * t) + p3.y * 1 / 6 * (t * t * t)
		# p.z = p0.z * 1 / 6 * (1 - 3 * t + 3 * t * t - t * t * t) + p1.z * 1 / 6 * (4 - 6 * t * t + 3 * t * t * t) + p2.z * 1 / 6 * (1 + 3 * t + 3 * t * t - 3 * t * t * t) + p3.z * 1 / 6 * (t * t * t)
		return 

	update: ->
		@subPointCircles[@pathFrame].fillColor = @debugColor if @debug
		@pathFrame = (@pathFrame + 1) % @subPoints.length		
		@subPointCircles[@pathFrame].fillColor = @debugHighlightColor if @debug
	
	getPoint: (i) =>
		switch i
			when 1 then @subPoints[(@pathFrame + Math.floor(@subPoints.length / 2)) % @subPoints.length]
			else @subPoints[@pathFrame]
	
	export: ->
		data = 
			id: @id
			points: @points



	onMoveHandle: (x,y) ->
		@position.x = x
		@position.y = y
		@linkedPoint.x = x
		@linkedPoint.y = y
		@target.recalculate()
		return


	@setter 'visible', (v) -> 
		for c in @subPointCircles
			c.visible = v
		for c in @handles
			c.visible = v

	@getter 'visible', -> @subPointCircles[0].visible