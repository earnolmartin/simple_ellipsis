(function ( $ ) {
	$.fn.simpleEllipsis = function( options ) {
		
		// Get options
		var settings = $.extend({
			keepHTML: true,
			charactersBeforeEllipsis: 80,			
			expanderLocation: "right-center",
			breakWord: true,
			spaceBeforeEllipsis: false,
			onClick: function(wrapper){
				return false;
			}
		}, options );
		
		if(!$("textarea.simpleEllipsisHidden").length){
			$(document.body).append('<textarea class="simpleEllipsisHidden simpleEllipsisHTMLDecodedTextArea"></textarea>');
		}
		
		return this.each(function() {			
			// Check to make sure a block element has been selected to truncate	
			var typeOfElem = $(this).css('display');
			
			if(typeOfElem == "block" && !$(this).hasClass("simpleEllipsisContainer")){
				// Get html and text
				var html = $(this).html();
				var text = $(this).text();
				html = html.replace(/\s+/g, " ").trim();
				text = text.replace(/\s+/g, " ").trim();
				
				// If our text length is greater than the character counter after which an ellipsis should be entered, go and truncate it!
				if(text.length > settings.charactersBeforeEllipsis){
					
					// Add wrapper div
					$(this).before('<div class="simpleEllipsisContainer"></div>');
					var wrapperToUse = $(this).prev(".simpleEllipsisContainer");
					wrapperToUse.html('');	
					
					// Set data attribute to store original text and HTML (used when the toggle expander is used)
					jQuery.data(wrapperToUse, "htmloforig", html);
					jQuery.data(wrapperToUse, "textoforig", text);
					
					// Truncate logic
					var textToDisplayWithEllipsis = null;
					if(settings.keepHTML === true){
						// Keep HTML and get the adjusted length (where HTML is not counted towards the limit)
						textToDisplayWithEllipsis = getTextIncludingHTMLToLength(settings.charactersBeforeEllipsis, html);
					}else{
						// Just working with text
						if(settings.breakWord){
							textToDisplayWithEllipsis = text.substring(0, settings.charactersBeforeEllipsis);
						}else{
							characterCountUntilNextSpace = findNextSpaceInVar(text, settings.charactersBeforeEllipsis);
							textToDisplayWithEllipsis = text.substring(0, settings.charactersBeforeEllipsis + characterCountUntilNextSpace);
						}
					}
					
					// Add space before ellipsis if configured
					if(settings.spaceBeforeEllipsis === true){
						// Don't add a space before the ellipsis if the last character is a space
						if(textToDisplayWithEllipsis[textToDisplayWithEllipsis.length - 1] !== ' ' && textToDisplayWithEllipsis[textToDisplayWithEllipsis.length - 1] !== String.fromCharCode(160)){ // http://stackoverflow.com/questions/22036576/why-does-the-javascript-string-whitespace-character-nbsp-not-match
							textToDisplayWithEllipsis += '&nbsp;';
						}
					}
					
					// Add ... to string
					textToDisplayWithEllipsis += '<span class="simpleEllipsisDotDotDot">&#8230;</span>';
						
					// Append the ellipsis
					jQuery.data(wrapperToUse, "htmlellipsis", textToDisplayWithEllipsis);	
							
					// Append the HTML to the wrapper --- jQuery will magically add closing tags to any html
					wrapperToUse.append(textToDisplayWithEllipsis);
					
					wrapperToUse.attr('dotdotdot', 'true');
					
					// Get classnames on the original element and move them into the wrapper
					var originalCSSClasses = $(this).attr("class");
					if(typeof originalCSSClasses != typeof undefined && originalCSSClasses != "" && originalCSSClasses != null){
						wrapperToUse.addClass(originalCSSClasses);
					}
															
					// Remove the element being truncated
					$(this).remove();			
						
					// Wire up click event for wrapper
					wireAndStyleWrapper(wrapperToUse, settings.expanderLocation);	
				}
			}
		});
		
		function findNextSpaceInVar(text, startPosition){
			var lengthToNextSpace = 0;
			var restOfStr = text.substring(startPosition);
			var positionOfNextSpace = restOfStr.indexOf(" ");
			
			if(positionOfNextSpace != -1){
				lengthToNextSpace = positionOfNextSpace;
			}
			
			return lengthToNextSpace;
		}
		
		function getTextIncludingHTMLToLength(length, html){
			// This function splits on HTML tags (both opening and closing), and adds to our character length so that we can still keep 
			// HTML that does not count towards the character limit showing up on the screen before the ellipsis is inserted
			
			var lengthToGo = length;
			var countOfGoodMatchedChars = Number(0);

			// Decode HTML entities (like &nbsp; &copy; and render them as is so as to not throw off our character count);
			html = filterForHTMLEntities(html);

			// Go parse it
			var piecesWithHTML = html.split(/(<\/?[^>]+>)/);
			if(piecesWithHTML.length > 1){
				piecesWithHTML = removeEmptyElementsFromArray(piecesWithHTML);
				for(var i = 0; i < piecesWithHTML.length; i++){
					var piece = piecesWithHTML[i];
					if(piece.match(/<\/?[^>]+>/)){
						lengthToGo += piece.length;
					}else{
						countOfGoodMatchedChars += piece.length
					}
					if(countOfGoodMatchedChars >= length){
						// Stop the loop.  We should be good.
						i = piecesWithHTML.length;
					}
				}
			}
			
			if(settings.breakWord){
				return html.substring(0, lengthToGo);
			}else{
				// Find next space... 
				var positionOfNextSpace = findNextSpaceInVar(html, lengthToGo);
				return html.substring(0, lengthToGo + positionOfNextSpace);
			}
		}
		
		function wireAndStyleWrapper(elem, location){
			// Remove inline styles
			$(elem).attr('style', '');
			
			// If we received an onclick function, use it and send them the wrapper
			if(jQuery.isFunction(options.onClick)){
				// Bind the click which will show all html or just the ellipsis version of it
				$(elem).off().click(function(e){
					settings.onClick(elem);
				});				
			}else{
				// Do our defaults if we received no onclick function (expand to show full text / click again to reshow ellipsis text)
				
				// Bind the click which will show all html or just the ellipsis version of it
				$(elem).off().click(function(e){
					if(typeof $(this).attr('dotdotdot') != typeof undefined && $(this).attr('dotdotdot') != ""){
						if($(this).attr('dotdotdot') == "true"){
							$(this).attr('dotdotdot', 'false');
							if(settings.keepHTML === true){
								$(this).html(jQuery.data(elem, "htmloforig"));
							}else{
								$(this).html(jQuery.data(elem, "textoforig"));
							}
							$(this).removeClass('simpleEllipsisExpand').removeClass('simpleEllipsisCollapse').addClass('simpleEllipsisCollapse');
						}else{
							$(this).attr('dotdotdot', 'true');
							$(this).html(jQuery.data(elem, "htmlellipsis"));
							$(this).removeClass('simpleEllipsisExpand').removeClass('simpleEllipsisCollapse').addClass('simpleEllipsisExpand');
						}
					}
				});
				
				// Style the element
				switch(location){
					default:
					case "right-center":
						$(elem).css('padding-right', '20px').css('background-position', 'right center');
						break;
					case "left-center":
						$(elem).css('padding-left', '20px').css('background-position', 'left center');
						break;
					case "top-left":
						$(elem).css('padding-left', '20px').css('background-position', 'left top');
						break;
					case "top-right":
						$(elem).css('padding-right', '20px').css('background-position', 'right top');
						break;
					case "bottom-right":
						$(elem).css('padding-right', '20px').css('background-position', 'right bottom');
						break;
					case "bottom-left":
						$(elem).css('padding-left', '20px').css('background-position', 'left bottom');
						break;
				}
				
				$(elem).removeClass('simpleEllipsisExpand').addClass('simpleEllipsisExpand');
			}
		}
		
		function removeEmptyElementsFromArray(arr){
			var newArr = Array();
			for(var i = 0; i < arr.length; i++){
				if(arr[i] !== ""){
					newArr.push(arr[i]);
				}
			}
			return newArr;
		}
		
		function filterForHTMLEntities(htmlText){
			if($(".simpleEllipsisHTMLDecodedTextArea").length){
				$(".simpleEllipsisHTMLDecodedTextArea")[0].innerHTML = htmlText;
				return $(".simpleEllipsisHTMLDecodedTextArea")[0].value;
			}
			return htmlText;
		}
	}
}( jQuery ));
