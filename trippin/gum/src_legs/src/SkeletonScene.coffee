class SkeletonScene

	options:
		width: 600
		height: 600
		container: "#container"
		showExportWindow: false
		showConstraints: false
		showMotionPaths: true
		showHandles: true

	showSettings: true
	preset: null

	debugColor: "#333"
	debugHighlightColor: "#999"
	draggedItem: null

	isPlaying: true
	@instance: null
	@events: null


	constructor: ->
		SkeletonScene.instance = @
		SkeletonScene.events = document

		# SETUP PAPER AND CANVAS
		$canvas = $("<canvas width='"+@options.width+"' height ='"+@options.height+"'/>")
		$(@options.container).append($canvas)
		@dom = @canvas = $canvas[0]
		paper.setup(@canvas)
		@project = paper.project
		@view = paper.view

		# ADD MISC TO STAGE
		@addExportWindow()


		$(window).resize(@onResize)
		@addGui() if @showSettings
		@addDragEvents()

		# MAKE A BODY
		@loadPreset("zombie")

		# START UPDATE LOOP
		@update()

	update: =>
		@body.update()
		@view.draw()
		window.requestAnimFrame(@update,null) if @isPlaying

	generateNewBody: ->
		@body = new skeleton.Body()
		@body.loadDefault()

	onResize: (e) ->
		return


	addGui: ->
		gui =  new dat.GUI()
		gui.add(@options,"showExportWindow").onChange () => document.dispatchEvent(new Event("toggleExportWindow"))
		gui.add(@options,"showConstraints").onChange () => 	document.dispatchEvent(new Event("toggleConstraints"))
		gui.add(@options,"showHandles").onChange () => 		document.dispatchEvent(new Event("toggleHandles"))
		gui.add(@options,"showMotionPaths").onChange () => 	document.dispatchEvent(new Event("toggleMotionPaths"))
		presetAr = []
		presetAr.push k for k,v of Presets
		gui.add(@,"preset",presetAr).onChange (e) => @loadPreset(e)

		gui.add(@,"export")
		gui.add(@,"import")

		@gui = gui

	clear: ->
		project = SkeletonScene.instance.project
		project.activeLayer.removeChildren()

	loadPreset: (key) =>
		@clear()
		obj = Presets[key]
		@body = new skeleton.Body()
		@body.load(obj)
		# @body.addHumanLines()

	import: =>
		@clear()
		obj = JSON.parse(@exportWindow.val())
		@body = new skeleton.Body()
		@body.load(obj)

		console.log obj

	export: =>
		@exportWindow.show()
		data = @body.export()
		dataStr = JSON.stringify(data)
		@exportWindow.val(dataStr)

	addExportWindow: ->
		@exportWindow = $("#debugTxt")
		@exportWindow.hide() unless SkeletonScene.instance.options.showExportWindow
		SkeletonScene.events.addEventListener "toggleExportWindow", () => 
			if(SkeletonScene.instance.options.showExportWindow)
				@exportWindow.show()
			else
				@exportWindow.hide()

	addDragEvents: ->
		project = SkeletonScene.instance.project

		$(document).mousedown (e) =>
			@draggedItem = null
			x = e.pageX
			y = e.pageY

			# project.activeLayer.selected = false
			hitResult = project.hitTest(new paper.Point(e.pageX,e.pageY))
			if hitResult?.item
				h = hitResult.item
				if h.isDraggable
					@draggedItem = h
					h.eMouseDown?(x,y)
					h.fillColor = @debugHighlightColor
					return
			return


		$(document).mousemove (e) =>
			if @draggedItem?
				x = e.pageX
				y = e.pageY
				@draggedItem.eMouseMove?(x,y)


		$(document).mouseup (e) =>
			if @draggedItem
				@draggedItem.fillColor = @debugColor
				@draggedItem.eMouseUp?(x,y)
				@draggedItem= null	


window.requestAnimFrame = (->
	window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback) ->
		window.setTimeout callback, 1000 / 60
)()		