#<< geom/Vec3
#<< geom/Vec2


class skeleton.Bone


	position: 			null
	endPosition: 		null
	length: 			null
	angle: 				null
	accAngle: 			null
	minAngle: 			null
	maxAngle: 			null

	parentBone:			null
	line: null
	p1: null
	p2: null

	debug: true
	debugColor: "#999"
	constraintColor: "#ff0000"

	fillColor: "#ffffff"

	constructor: (options) ->
		util.General.copyObject(options,@)
		@p1 = new paper.Point(@position.x,@position.y)
		@p2 = new paper.Point(@endPosition.x,@endPosition.y+100)

		@line = new paper.Path.Line(@p1,@p2)
		@p1 = @line.segments[0].point
		@p2 = @line.segments[1].point

		@minLine = new paper.Path.Line(@p1,@p2)
		@maxLine = new paper.Path.Line(@p1,@p2)
		@minLine.strokeColor = @constraintColor
		@maxLine.strokeColor = @constraintColor

		@maxLine.visible = @minLine.visible = SkeletonScene.instance.options.showConstraints
		SkeletonScene.events.addEventListener "toggleConstraints", () => @toggleConstraints(SkeletonScene.instance.options.showConstraints)
		SkeletonScene.events.addEventListener "toggleHandles", () => @handle.visible = SkeletonScene.instance.options.showHandles if @handle

		@line.strokeColor = @fillColor
		@line.strokeWidth = 2
		# console.log "new bone", @p1, @p2

	toggleConstraints: (val) ->
		@minLine.visible = val
		@maxLine.visible = val


	addHandle: ->
		@handle = new paper.Path.Circle(@p1,10)
		@handle.position = @p1
		@handle.linkVector = @position
		@handle.isDraggable = true
		@handle.eMouseMove = @onMoveHandle
		@handle.fillColor = @debugColor
		@handle.visible = SkeletonScene.instance.options.showHandles

	addFoot: ->
		foot = new paper.Path()
		foot.add(new paper.Point(0,0))
		foot.add(new paper.Point(20,10))
		foot.add(new paper.Point(0,10))
		foot.lastAngle = 0.0
		# @line.addChild(foot)

		@foot = foot
		@foot.position = @p2

		foot.fillColor = @fillColor

	propagate: ->
		if @parentBone
			@position.set @parentBone.endPosition.x, @parentBone.endPosition.y
			@accAngle = @angle + @parentBone.accAngle
		else
			@accAngle = @angle
		@endPosition.x = @position.x + @length * Math.cos(@accAngle)
		@endPosition.y = @position.y + @length * Math.sin(@accAngle)
		@position.y = @ground  if @position.y > @ground
		@endPosition.y = @ground  if @endPosition.y > @ground

	drawConstraints: ->
		prevAccAngle = 0
		prevAccAngle = @parentBone.accAngle if @parentBone
		minX = @position.x + 30 * Math.cos(@minAngle + prevAccAngle)
		minY = @position.y + 30 * Math.sin(@minAngle + prevAccAngle)
		maxX = @position.x + 30 * Math.cos(@maxAngle + prevAccAngle)
		maxY = @position.y + 30 * Math.sin(@maxAngle + prevAccAngle)
		@minLine.segments[0].point.x = @position.x
		@minLine.segments[0].point.y = @position.y
		@maxLine.segments[0].point.x = @position.x
		@maxLine.segments[0].point.y = @position.y

		@minLine.segments[1].point.x = minX
		@minLine.segments[1].point.y = minY
		@maxLine.segments[1].point.x = maxX
		@maxLine.segments[1].point.y = maxY

	export: -> 
		{
			position: 		@position
			endPosition:	@endPosition
			length: 		@length
			angle: 			@angle
			accAngle: 		@accAngle
			minAngle: 		@minAngle
			maxAngle: 		@maxAngle
		}


	update: ->
		@p1.x = @position.x
		@p1.y = @position.y
		@p2.x = @endPosition.x
		@p2.y = @endPosition.y

		@drawConstraints()

		# if @foot # NOT WORKING
		# 	@foot.position = @p2


		# 	deltaAngle = @accAngle * 50
		# 	@foot.rotate(-@foot.lastAngle)
		# 	@foot.rotate(deltaAngle)
		# 	@foot.lastAngle = deltaAngle
			# @foot.applyMatrix(new paper.Matrix())
			# @foot.transform(new paper.Matrix().rotate(deltaAngle))
			# @foot.lastAngle = deltaAngle

	onMoveHandle: (x,y) ->
		@position.x = x
		@position.y = y
		@linkVector.x = x
		@linkVector.y = y