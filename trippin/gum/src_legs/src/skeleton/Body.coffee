
class skeleton.Body

	motions: null
	limbs: null
	playing: false

	constructor: ->
		@clear()
		@

	clear: ->
		@motions = []
		@limbs = []
		@currentBoneIndex = 0

	loadDefault: ->
		width = SkeletonScene.instance.options.width
		height = SkeletonScene.instance.options.height

		hipPos = 
			x: width/2
			y: height/2


		@motions.push @legMotion = new geom.MotionPath({x: hipPos.x + 10, y: hipPos.y + 100})
		@limbs.push @leftLeg 	= new skeleton.Leg(hipPos, @legMotion, 0)
		@limbs.push @rightLeg 	= new skeleton.Leg(hipPos, @legMotion, 1)
		# @rightArm = new 

		torsoLength = 75
		shoulderPos =
			x: hipPos.x
			y: hipPos.y - torsoLength


		@motions.push @armMotion = new geom.MotionPath({x: hipPos.x , y: hipPos.y })
		@limbs.push @leftArm= new skeleton.Arm(shoulderPos, @armMotion, 0)
		@limbs.push @rightArm= new skeleton.Arm(shoulderPos, @armMotion, 1)
		@playing = true

	addHumanLines: ->
		@lineHip = new paper.Path.Line(@limbs[0].position, @limbs[1].position)
		@lineHip.strokeColor = "white"
		@lineHip.strokeWidth = 2

		@midHip = midPoint(@limbs[0].position, @limbs[1].position)

		@lineShoulder = new paper.Path.Line(@limbs[2].position, @limbs[3].position)
		@lineShoulder.strokeColor = "white"
		@lineShoulder.strokeWidth = 2

		@midShoulder = midPoint(@limbs[2].position, @limbs[3].position)

		headDir = @midShoulder.clone()
		headDir.x -= @midHip.x
		headDir.y -= @midHip.y
		headDir = headDir.normalize()

		headPos = @midShoulder.clone()
		headPos.x += headDir.x * 30
		headPos.y += headDir.y * 30

		@head = new paper.Path.Circle headPos, 10
		@head.fillColor = "#00ff00"



		@shapeTorso = new paper.Path()
		@shapeTorso.add @limbs[0].position
		@shapeTorso.add @limbs[1].position
		@shapeTorso.add @limbs[3].position
		@shapeTorso.add @limbs[2].position
		@shapeTorso.closePath()

		@shapeTorso.fillColor = "#999"
		@shapeTorso.strokeWidth = 2
		@shapeTorso.strokeColor = "white"
		@shapeTorso.sendToBack()

		@limbs[2].sendToBack()

		


	load: (data) ->
		@clear()

		for m in data.motions
			@motions.push new geom.MotionPath().load(m)

		for l in data.limbs
			l.motionPath = @motions[l.pathId]
			@limbs.push new skeleton.Limb().load(l)

		console.log "loaded!", @
			
		@playing = true			


	export: ->
		data = 
			motions: []
			limbs: []

		data.motions.push m.export() for m in @motions
		data.limbs.push l.export() for l in @limbs
		data

		# 	gui.add(@settings,"minSize",0.0,100.0).onChange @redraw
		# 	gui.add(@settings,"maxSize",0.0,500.0).onChange @redraw

		# 	gui.add(@settings,"minLifetime",0.0,10.0).onChange @redraw
		# 	gui.add(@settings,"maxLifetime",0.0,10.0).onChange @redraw

		# 	gui.add(@settings,"particleCount",0.0,500).onChange @redraw
		# 	gui.add(@settings,"orbitDistance",0.0,500.0).onChange @redraw
		# 	gui.add(@settings,"orbitSpeed",0.0,0.1).onChange @redraw
		# 	gui.add(@settings,"spawnSpeed",0.0,200.0).onChange @redraw
		# 	gui.add(@settings,"randomDistance",0.0,100.0).onChange @redraw
		# else
		# 	copyObject(@presets.remembered["Default"],@settings)
		# 	@settings.moveSpeed = Math.random() * 0.5 + 0.2
		# 	@settings.offset = Math.random() * 100.0
		# 	@settings.orbitDistance = 500.0 + Math.random() * 500.0

	update: ->
		return unless @playing
		l.update() for l in @limbs
		m.update() for m in @motions

