##= require ./verlet

class RubberPoint extends VerletPoint

	rubberAmplitude: 0.1
	rubberDamping: 0.1
	rubberForceX: 0
	rubberForceY: 0

	@maxAmp: 0.02
	@minAmp: 0.005

	constructor: (@x, @y, @locked = false) ->
		super(@x,@y,@locked)
		@rubberAmplitude = RubberPoint.minAmp + (RubberPoint.maxAmp - RubberPoint.minAmp)
		
	update: ->
		return null if @dead || @down || @locked

		@rubberForceX = ( @originalX - @x ) * @rubberAmplitude
		@rubberForceY = ( @originalY - @y ) * @rubberAmplitude

		@x += @rubberForceX
		@y += @rubberForceY
		super()

	@resetDefaults: ->
		RubberPoint.minAmp = 0.02
		RubberPoint.maxAmp = 0.005
