#<< geom/Vec3
#<< geom/Vec2
#<< skeleton/Limb


Vec3 = geom.Vec3
Vec2 = geom.Vec2

class skeleton.Arm extends skeleton.Limb


	constructor: (@rootPosition,@motionPath,@targetFunc) ->
		@boneLength = 50
		super(@rootPosition,@motionPath,@targetFunc)

	init: ->

		@bones.push b1 = new skeleton.Bone
			position: new Vec2( @rootPosition.x , @rootPosition.y )
			endPosition: new Vec2( @rootPosition.x , @rootPosition.y + @boneLength )
			length: @boneLength
			angle: 0
			accAngle: 0
			minAngle: 10 / RAD_2_DEG
			maxAngle: 170 / RAD_2_DEG

		b1.addHandle()

		@bones.push b2 = new skeleton.Bone
			position: new Vec2( @rootPosition.x , @rootPosition.y + @boneLength )
			endPosition: new Vec2( @rootPosition.x , @rootPosition.y + @boneLength * 2 )
			length: @boneLength
			angle: 0
			accAngle: 0
			minAngle: -90 / RAD_2_DEG
			maxAngle: 0 / RAD_2_DEG

		b2.parentBone = b1

		super()
