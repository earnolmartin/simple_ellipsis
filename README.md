# Simple Ellipsis
jQuery Ellipsis Plugin

### About

Simple Ellipsis is a jQuery plugin that allows you to ellipsis long sections of text and unellipsis long sections of text with a mouse click.

Unlike CSS text ellipsis overflow, this plugin allows you to quickly ellipsis, hide, and show the full unellipsis text with a mouse click.

It is simpler to use the CSS approach, but this plugin gives you a little more control over how it should display.  A fixed length of text can display before an ellipsis is added for consistency reasons.  However, I'd probably recommend using the pure CSS approach which this plugin does not use.

This plugin was mainly an experiment to see how this could be done using jQuery based on fixed parameters. 

### Usage:
1. Make sure the jQuery library is loaded in the <head> section of your web page.
2. Include the simple_ellipsis.min.js and simple_ellipsis.min.css files after loading the jQuery library like so:
```
<head>
	<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
	<script type="text/javascript" src="simple_ellipsis.min.js"></script>
	<link rel="stylesheet" type="text/css" href="simple_ellipsis.min.css">
	<title>Page Title</title>
```
3. In another script, within the document.ready jQuery function, use a jQuery selector to specify which element you want to change into an ellipsised control by calling the .simpleEllipsis function.  Here's an example:
```
<script type="text/javascript">
	$( document ).ready(function() {
		$("div.sample").simpleEllipsis();
	});
</script>
```
4. Make sure your div element that you are transforming into a sharing widget exists in the body.
```
<body>
	<div class="sample"></div>
</body>
```
### Options:

- keepHTML (boolean [default true]): If true, inline HTML will be preserved in the element being ellipsised and will NOT be counted towards the character limit. If false, only text will be preserved in the ellipsised text and the markup will be lost.
- charactersBeforeEllipsis (int [default 80]): Specify how many characters should show before an ellipsis should cut off the remaining text. (keep in mind that space characters count towards this limit, so please be sure to nest your HTML properly without preceding spaces between elements and your actual text content)  
- expanderLocation (str [default "top-right"]):  Location for expand and collapse icon if using the default click behavior (by not passing in a custom onClick function)
  - values:
    - top-right
    - top-left
    - bottom-right
    - bottom-left
    - right-center
    - left-center
- breakWord (boolean [default true]): If true, the ellipsis can be appended in the middle of a word (space characters count).  If false, the ellipsis will come at the end of the last word closest to the character limit specified.  
- spaceBeforeEllipsis (boolean [default false]):  If true, a space will be inserted before the ellipsis if the last character in the ellipsised string is not a space character (which can happen when the breakWord option is set to true). 
- onClick (function [default expand / collapse behavior]):  A custom function object called when the ellipsised text is clicked on which overrides the default expand and collapse behavior.  When this function is called, the element clicked on is passed to your function containing data properties with the original Text/HTML (e.g. jQuery.data(elem, "htmloforig"); for HTML and jQuery.data(elem, "textoforig"); for Text) and ellipsised Text/HTML (e.g. jQuery.data(elem, "htmlellipsis");) that your function can use for custom behavior.
	Example:
	```
	$(".sample2").simpleEllipsis({
		onClick: handleClick,
	});
	
	function handleClick(elem){
		var ellipsisHTML = jQuery.data(elem, "htmlellipsis");
		var fullHTML = jQuery.data(elem, "htmloforig");
		alert("Full HTML is " + fullHTML);
	}
	```

### Return Methods:
none

### Practical Examples and Samples:
[Simple Ellipsis Samples and Tests](http://eamster.tk/simple_ellipsis/)
