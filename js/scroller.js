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
		howmuchMoved = 0;
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
})();