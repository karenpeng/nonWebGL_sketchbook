

class VerletStick
	constructor: (a, b) ->
		@pointa = a
		@pointb = b
		@torn = false
		@tearResist = 9999 #Math.random() * 20 + 20
		dx = a.x - b.x
		dy = a.y - b.y
		@hypotenuse = Math.sqrt(dx * dx + dy * dy)

		if @pointa.locked && @pointb.locked
			@contract =>
				return null

		else if @pointa.locked
			@contract = =>
				dx = @pointb.x - @pointa.x
				dy = @pointb.y - @pointa.y
				h = Math.sqrt(dx * dx + dy * dy)
				@torn = true  if h > @tearResist
				diff = @hypotenuse - h
				offx = (diff * dx / h)
				offy = (diff * dy / h)
				@pointb.x += offx
				@pointb.y += offy
				return null

		else if @pointb.locked
			@contract = =>
				dx = @pointb.x - @pointa.x
				dy = @pointb.y - @pointa.y
				h = Math.sqrt(dx * dx + dy * dy)
				@torn = true  if h > @tearResist
				diff = @hypotenuse - h
				offx = (diff * dx / h)
				offy = (diff * dy / h)
				@pointa.x -= offx
				@pointa.y -= offy
				return null

		else
			@contract = =>
				dx = @pointb.x - @pointa.x
				dy = @pointb.y - @pointa.y
				h = Math.sqrt(dx * dx + dy * dy)
				@torn = true  if h > @tearResist
				diff = @hypotenuse - h
				offx = (diff * dx / h) * .5
				offy = (diff * dy / h) * .5
				@pointa.x -= offx
				@pointa.y -= offy
				@pointb.x += offx
				@pointb.y += offy	
				return null