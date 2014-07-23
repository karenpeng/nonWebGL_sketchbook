#<< geom/Vec3
#<< geom/Vec2
#<< util/General

Vec3 = geom.Vec3
Vec2 = geom.Vec2

class skeleton.Limb

	boneLength: 75
	currentBoneIndex: 0
	rootPosition: null

	constructor: (@rootPosition,@motionPath,@pathPointId) ->
		@bones = []
		@init()
		@

	load: (data) ->
		@pathPointId = data.pathPointId
		@motionPath = data.motionPath

		parentBone = null
		i = 0
		for b in data.bones
			b.position = new Vec2(b.position.x,b.position.y)
			b.endPosition = new Vec2(b.endPosition.x,b.endPosition.y)
			@bones.push bone = new skeleton.Bone(b)
			if i == 0
				bone.addHandle() 
			else
				bone.parentBone = parentBone

			parentBone = bone
			i++
		@init()
		@


	init: ->
		b.propagate() for b in @bones


	update: ->
		target = @motionPath.getPoint(@pathPointId)
		i = 0
		while i < @bones.length
			@solve(target)
			i++

		b.update() for b in @bones

	solve: (target) ->
		bone = @bones[@currentBoneIndex]

		boneDirection = Vec2.create().asSub(@bones[@bones.length - 1].endPosition, bone.position)
		directionToTarget = Vec2.create().asSub(target, bone.position)
		if boneDirection.length() > 0 and directionToTarget.length() > 0
			boneDirection.normalize()
			directionToTarget.normalize()
			dot = boneDirection.dot(directionToTarget)
			cross = Vec3.create().asCross(Vec3.create(boneDirection.x, boneDirection.y, 0), Vec3.create(directionToTarget.x, directionToTarget.y, 0))
			angle = Math.acos(dot)
			unless isNaN(angle)
				if cross.z > 0
					bone.angle += angle
				else
					bone.angle -= angle
				bone.angle = limit(bone.angle, bone.minAngle, bone.maxAngle)
		@currentBoneIndex = (@currentBoneIndex - 1 + @bones.length) % @bones.length
		b.propagate() for b in @bones
		return			

	export: ->
		data =
			bones: []
			pathId: @motionPath.id
			pathPointId: @pathPointId

		for b in @bones
			data.bones.push b.export()
		data

	sendToBack: ->
		for b in @bones
			b.line.sendToBack()

	@getter "position", () -> @bones[0].p1