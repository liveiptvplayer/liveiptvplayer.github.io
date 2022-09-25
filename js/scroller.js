(function()
{
	let targetElement = document.querySelector(".categories");
	
	targetElement.addEventListener('mousedown', handleMouseDown, false);
	document.addEventListener('mouseup', handleMouseUp, false);
	document.addEventListener('mousemove', handleMouseMovement, false);
	
	const categoriesList = targetElement.children;
	for(let i = 0, j = categoriesList.length; i < j; i++)
	{
		categoriesList[i].onclick = function(e)
		{
			ActivateCategory(e.target, true);
		};
	}
	
	let keepListening = false, howmuchMoved = 0, startX, elemposStart;
	
	function handleMouseDown(e)
	{
		keepListening = true;
		startX = e.clientX;
		elemposStart = targetElement.scrollLeft;
		howmuchMoved = 0;
	}
	
	function handleMouseMovement(e)
	{
		if (keepListening)
		{
			let posChange = startX - e.clientX;
			if (!isNaN(posChange))
			{
				let newPos = elemposStart + posChange;
				if (newPos < 0)
					newPos = 0;
				
				howmuchMoved = Math.abs(posChange);
				
				targetElement.scrollLeft = newPos;
			}
		}
	}
	
	function handleMouseUp()
	{
		keepListening = false;
		setTimeout(function()
		{
			howmuchMoved = 0;
		}, 30);
	}
	
	ActivateCategory = function(Element, Scroll)
	{
		if (Element.tagName === "I")
			Element = Element.parentNode;
		
		if (!Element.className.includes("active") && howmuchMoved < 5)
		{
			CacheValue("Category", Element.innerText);
			
			for(let i = 0, j = categoriesList.length; i < j; i++) {
				categoriesList[i].className = "category";
			}
			
			Element.className = "category active";
			
			if (Scroll) {
				Element.parentNode.scrollTo({left: (Element.offsetLeft - (Element.parentNode.clientWidth / 2) + (Element.clientWidth / 2)), behavior: 'smooth'});
			}
			let ElementText = Element.innerText.trimStart();
			const ElementCategory = ElementText.substr(0, ElementText.indexOf(' '));
			if (ElementCategory == "ALL")
			{
				ShowElements(null);
			}
			else
			{
				ShowElements(ElementCategory);
			}
		}
	}
	
	function ShowElements(attribute)
	{
		const channelsHandler = document.querySelector(".channelsHandler");
		channelsHandler.scrollTo({top: 0, behavior: 'smooth'});
		channelsHandler.style.opacity = 0;
		setTimeout(function() {
			const channelsList = document.querySelectorAll(".channelItem");
			channelsList.forEach(channel =>
			{
				if (attribute == null)
				{
					channel.style.display = null;
				}
				else
				{
					const channelCategories = channel.getAttribute("data-value");
					if (channelCategories != null)
					{
						let hasCategory = false;
						for (let i = 0, channelCategory = channelCategories.split(" "), j = channelCategory.length; i < j; i++)
						{
							if (channelCategory[i] == attribute)
							{
								channel.style.display = null;
								hasCategory = true;
								break;
							}
						}
						
						if (!hasCategory)
						{
							channel.style.display = "none";
						}
					}
					else
					{
						channel.style.display = "none";
					}
				}
			});
			channelsHandler.style.opacity = 1;
		}, 150);
	}
	
	function horizontalWheel(container) {
		/** Max `scrollLeft` value */
		let scrollWidth;

		/** Desired scroll distance per animation frame */
		let getScrollStep = () => scrollWidth / 100 /* ADJUST TO YOUR WISH */ ;

		/** Target value for `scrollLeft` */
		let targetLeft;

		function scrollLeft() {
			let beforeLeft = container.scrollLeft;
			let wantDx = getScrollStep();
			let diff = targetLeft - container.scrollLeft;
			let dX = wantDx >= Math.abs(diff) ? diff : Math.sign(diff) * wantDx;

			// Performing horizontal scroll
			container.scrollBy(dX, 0);

			// Break if smaller `diff` instead of `wantDx` was used
			if (dX === diff)
			  return;

			// Break if can't scroll anymore or target reached
			if (beforeLeft === container.scrollLeft || container.scrollLeft === targetLeft)
			  return;

			requestAnimationFrame(scrollLeft);
		}

		container.addEventListener('wheel', e => {
			e.preventDefault();

			scrollWidth = container.scrollWidth - container.clientWidth;
			targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));

			requestAnimationFrame(scrollLeft);
		});
	}
	
	horizontalWheel(targetElement);
	
})();