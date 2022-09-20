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
			ActivateCategory(e.target);
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
	}
	
	ActivateCategory = function(Element)
	{
		if (!Element.className.includes("active") && howmuchMoved < 5)
		{
			CacheValue("Category", Element.innerText);
			
			for(let i = 0, j = categoriesList.length; i < j; i++)
			{
				categoriesList[i].className = "category";
			}
			
			Element.className = "category active";
			
			const ElementCategory = Element.innerText.substr(0, Element.innerText.indexOf(' '));
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
		}, 200);
	}
})();