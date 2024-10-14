; (function ($) {
	"use strict"

	$(document).ready(function () {
		initStickyFooter()
		initLazyLoadingForImages()
		initObjectFitImagesPolyfil()
		initSmallHeaderAfterScroll()
		initMobileMenu()
		scrollTopBtn()
		initInsertVideoIframe()
		initReviewsSlider()
		initScrollToElement()
		initPopovers()
		initDateFormatForInput()
		initDetectNotFullFunctionality()
		initCalculation()
		savePdfOnClick()
		initAccordionScroll()
		initRemoveLinksFromProductsInSubscription()
		//initRedirectForRenewProSubscribe();
		initAddMonthPrice()
		initСorrectionUnlimitedPlan()
		initStickyScrollBlock()
		removeCriticalCss()
		initCountDown()

		$(window).on("resize", function () {
			initStickyFooter()
		})
	})

	// const URL_API = "https://matrix-destiny-72c368cc6a89.herokuapp.com"
	const URL_API = "/wp-json/c/v1/calc"

	// var API_CHECKDATE = URL_API + '/api/v2/calculate/',
	// 	API_COMPATIBILITY = URL_API + '/api/v2/compat?',
	// 	API_CHILDREN = URL_API + '/api/v2/children/calculate/';	
	
	var API_CHECKDATE = URL_API + '/calculate/',
		API_COMPATIBILITY = URL_API + '/compat?',
		API_KID = URL_API + '/children/calculate/';

	// STICKY FOOTER
	function initStickyFooter() {
		// 1) height of footer
		var footerHeight = $(".js-footer").outerHeight()

		// 2) compensation
		$(".js-wrap-for-sticky").css({
			"padding-bottom": footerHeight,
		})
	}

	// LAZY LOADING FOR IMAGES
	function initLazyLoadingForImages() {
		$(".js-lazy").Lazy({
			effect: "fadeIn",
			effectTime: 300,

			afterLoad: function (element) {
				var image = $(element)

				if (image.hasClass("lazy-picture")) {
					image.addClass("-active")
					image = image.find("img")
				}

				if (image.hasClass("js-of-image")) {
					objectFitImages(image)
				}
			},
		})
	}

	// OBJECT FIT POLIFIL
	function initObjectFitImagesPolyfil() {
		var $ofImage = $("img.js-of-image:not(.js-lazy)")
		objectFitImages($ofImage)
	}

	// SMALL HEADER AFTER SCROLL
	function initSmallHeaderAfterScroll() {
		var header = $(".js-header")

		$(window).on("scroll", function () {
			if ($(this).scrollTop() > 10) {
				header.addClass("-small")
			} else {
				header.removeClass("-small")
			}
		})

		if ($(document).scrollTop() > 10) {
			header.addClass("-small")
		}
	}

	// MOBILE MENU
	function initMobileMenu() {
		var hamburger = $(".js-hamburger"),
			header = $(".js-header"),
			mobileMenu = $(".js-mobile-menu"),
			menuNavigationLink = mobileMenu.find("a"),
			body = $("body")

		function openMobileMenu() {
			hamburger.addClass("-active")
			mobileMenu.addClass("-active")
			header.addClass("-active")
			body.addClass("-overflow-hidden")
		}

		function closeMobileMenu() {
			hamburger.removeClass("-active")
			mobileMenu.removeClass("-active")
			header.removeClass("-active")
			body.removeClass("-overflow-hidden")
		}

		hamburger.on("click", function (e) {
			e.preventDefault()

			if (!$(this).hasClass("-active")) {
				openMobileMenu()
			} else {
				closeMobileMenu()
			}
		})

		menuNavigationLink.on("click", function () {
			closeMobileMenu()
		})
	}

	// INIT SCROLL TOP BUTTON
	function scrollTopBtn() {
		function showHideScrollTopBtn(distance) {
			var scrollTopBtn = $(".js-scroll-top-btn")

			$(window).on("scroll", function () {
				if ($(this).scrollTop() > distance) {
					scrollTopBtn.addClass("-show")
				} else {
					scrollTopBtn.removeClass("-show")
				}
			})

			if ($(document).scrollTop() > distance) scrollTopBtn.addClass("-show")
		}

		function scrollTopAnimation() {
			var scrollTopBtn = $(".js-scroll-top-btn"),
				scrollingComplete = true

			scrollTopBtn.on("click", function () {
				if (scrollingComplete) {
					scrollingComplete = false

					$("body, html")
						.animate(
							{
								scrollTop: 0,
							},
							1000
						)
						.promise()
						.done(function () {
							scrollingComplete = true
						})

					return false
				}
			})
		}

		// 1) checking the distance from the top of the page
		showHideScrollTopBtn(100)
		// 2) сlick event to scroll top
		scrollTopAnimation()
	}

	// INIT DATE FORMAT FOR INPUT
	function initDateFormatForInput() {
		function addZero(i) {
			if (i < 10) {
				i = "0" + i
			}

			return i
		}

		var d = new Date(),
			currentDate =
				d.getFullYear() +
				"-" +
				addZero(d.getMonth() + 1) +
				"-" +
				addZero(d.getDate())

		if ($(".js-input-with-date").length) {
			$(".js-input-with-date").each(function (index, input) {
				var cleave = new Cleave(input, {
					date: true,
					delimiter: ".",
					dateMax: currentDate,
					datePattern: ["d", "m", "Y"],
				})
			})
		}
	}

	function showPreloader(calculationWrap) {
		calculationWrap.find(".js-preloader").addClass("-show")
	}

	function hidePreloader(calculationWrap) {
		calculationWrap.find(".js-preloader").removeClass("-show")
	}

	function initDetectNotFullFunctionality() {
		var formWithCalculation = $(".js-form-with-calculation")

		if (!formWithCalculation.length) return

		formWithCalculation.each(function () {
			if ($(this).hasClass("js-not-full-functionality")) {
				$(this).get(0).notFullFunctionality = true
			} else {
				$(this).get(0).notFullFunctionality = false
			}
		})
	}

	// INIT CALCULATION
	function initCalculation() {
		// helper functions
		function getAgeFromBirthdate(dob) {
			var dob = new Date(dob.split(".").reverse().join("-")),
				today = new Date(),
				age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000))

			return age
		}

		function beginCalculationFromTheBeginning(calculationWrap) {
			calculationWrap.find(".js-calculation-begin").removeClass("d-none")
			calculationWrap.find(".js-calculation-block").addClass("d-none")
			calculationWrap.find(".js-calculation-accordion").empty()

			setTimeout(function () {
				if ($(".section-about").length) {
					// in home page
					$("body, html").animate(
						{
							scrollTop: calculationWrap
								.closest(".section")
								.find(".js-anchor-title")
								.offset().top,
						},
						1000
					)
				} else if ($(".blog-article").length) {
					// in single blog
					$("body, html").animate(
						{
							scrollTop:
								calculationWrap.closest(".section-calculation").offset().top -
								60,
						},
						1000
					)
				} else if ($(".section-woocommerce-main-content").length) {
					// in account page
					$("body, html").animate(
						{
							scrollTop: calculationWrap.find(".js-anchor-title").offset().top,
						},
						1000
					)
				}
			}, 100)
		}

		function resetForm(form) {
			form.find('input[type="text"]').val("")
			form.find("select").each(function (number, item) {
				$(item).find("option").first().prop("selected", true)
			})
		}

		function getSortedForecast(data) {
			var dataJson = data,
				forecastArray = []

			for (var i = 0; i < dataJson.data.length; i++) {
				if (dataJson.data[i].blockType === "forecast") {
					var allForecastBlocks = dataJson.data[i]

					for (var j = 0; j < allForecastBlocks.blocks.length; j++) {
						var title = allForecastBlocks.blocks[j].title,
							firstYearValue =
								title.indexOf("-") !== -1 ? +title.split("-")[0] : +title,
							text = allForecastBlocks.blocks[j].content

						var skipParent = false

						for (var k = 0; k < forecastArray.length; k++) {
							if (forecastArray[k].title === title) {
								skipParent = true
							}
						}

						if (skipParent) continue

						forecastArray.push({
							title: title,
							content: text,
							id: firstYearValue,
						})
					}
				}
			}

			forecastArray.sort(function (a, b) {
				if (a.id > b.id) {
					return 1
				}
				if (a.id < b.id) {
					return -1
				}
				return 0
			})

			return forecastArray
		}

		function textFormatting(text) {
			return (
				'<div class="text-block"><p>' +
				text.trim().replace(/\n+/g, "</p><p>") +
				"</p></div>"
			)
		}

		function createForecastSlider(forecastArray, currentAge, language) {
			var element = document.querySelector('.js-check-date-form') || document.querySelector('.js-check-date-home-form') || document.querySelector('.js-kid-form')
			var notFullFunctionality = $(element).get(
				0
			).notFullFunctionality

			var yearsSlider =
				'<div class="slider-forecast-years js-slider-forecast-years">',
				textSlider =
					'<div class="slider-forecast-text js-slider-forecast-text">'

			var notificationText = ""

			if (language === "ru") {
				notificationText = "Данный пункт будет доступен в платной версии"
			} else if (language === "en") {
				notificationText = "This article will be available in the paid version"
			}

			for (var i = 0; i < forecastArray.length; i++) {
				var title = forecastArray[i].title,
					text = forecastArray[i].content.trim().replace(/\n+/g, "</p><p>")

				if (title.indexOf(currentAge.toString()) !== -1) {
					yearsSlider +=
						'<div><p class="forecast-years-item -active">' +
						title +
						"</p></div>"
				} else {
					yearsSlider +=
						'<div><p class="forecast-years-item">' + title + "</p></div>"
				}

				if (notFullFunctionality) {
					if (title.indexOf(currentAge.toString()) !== -1) {
						textSlider += "<div><p>" + text + "</p></div>"
					} else {
						textSlider += "<div><p>" + notificationText + "</p></div>"
					}
				} else {
					textSlider += "<div><p>" + text + "</p></div>"
				}
			}

			yearsSlider += "</div>"
			textSlider += "</div>"

			return [yearsSlider, textSlider]
		}

		function buildAccordionItem(
			accordionTitle,
			accordionContent,
			index,
			id,
			itemIsLock,
			language,
			blockType,
			positions
		) {
			var accordionItem = ""

			if (positions === undefined) positions = null

			if (itemIsLock) {
				var popoverText = ""

				if (language === "ru") {
					popoverText = "Данный пункт будет доступен в платной версии"
				} else if (language === "en") {
					popoverText = "This article will be available in the paid version"
				}

				accordionItem +=
					'<div class="accordion__item -lock js-accordion-item" data-block-type="' +
					blockType +
					'">'
				accordionItem +=
					'<button class="accordion__btn" type="button" data-toggle="popover" data-content="' +
					popoverText +
					'">' +
					accordionTitle +
					"</button>"
				accordionItem += "</div>"
			} else {
				accordionItem +=
					'<div class="accordion__item -with-collapse js-accordion-item" data-block-type="' +
					blockType +
					'" data-personal-calculation-positions="' +
					positions +
					'">'
				accordionItem +=
					'<button class="accordion__btn" type="button" data-toggle="collapse" data-target="#collapse-' +
					index +
					'" aria-expanded="false" aria-controls="collapse-' +
					index +
					'">' +
					accordionTitle +
					"</button>"
				accordionItem +=
					'<div class="collapse" id="collapse-' +
					index +
					'" data-parent="#' +
					id +
					'-accordion">'
				accordionItem += '<div class="accordion__body">'
				accordionItem += accordionContent
				accordionItem += "</div></div></div>"
			}

			return accordionItem
		}

		function createSubAccordion(
			articleBlocks,
			blockType,
			id,
			index,
			language,
			positions
		) {
			var subAccordion =
				'<div class="accordion js-second-level-accordion" id="' +
				id +
				'-accordion">'

			for (var i = 0; i < articleBlocks.length; i++) {
				var accordionTitle = articleBlocks[i].title,
					accordionContent = "",
					accordionTextOriginal = articleBlocks[i].content,
					accordionText = textFormatting(accordionTextOriginal),
					subAccordionPositions = null

				if (positions[i]) {
					subAccordionPositions = positions[i].join(",")
				}

				if (accordionTextOriginal.length) {
					accordionContent += '<div class="accordion__body-item">'
					accordionContent += accordionText
					accordionContent += "</div>"
				}

				if (blockType === "health") {
					var accordionTextPersonalRecommendationsOriginal =
						articleBlocks[i].additional.personalRecommendations,
						accordionTextPersonalRecommendations = textFormatting(
							accordionTextPersonalRecommendationsOriginal
						),
						personalRecommendationsTitle = ""

					if (language === "ru") {
						personalRecommendationsTitle = "Личные рекомендации"
					} else if (language === "en") {
						personalRecommendationsTitle = "Personal recommendations"
					}

					if (accordionTextPersonalRecommendationsOriginal.length) {
						accordionContent += '<div class="accordion__body-item">'
						accordionContent += "<h5>" + personalRecommendationsTitle + "</h5>"
						accordionContent += accordionTextPersonalRecommendations
						accordionContent += "</div>"
					}
				}

				if (
					accordionTitle.length &&
					(accordionTextOriginal.length ||
						accordionTextPersonalRecommendationsOriginal.length)
				) {
					subAccordion += buildAccordionItem(
						accordionTitle,
						accordionContent,
						index + "-" + i,
						id,
						false,
						language,
						blockType,
						subAccordionPositions
					)
				}
			}

			subAccordion += "</div>"

			return subAccordion
		}

		function createAccordionItem(
			articleObject,
			index,
			language,
			sortedForecastArray,
			currentAge,
			calculationForm
		) {
			var accordionItem = "",
				title = articleObject.title,
				accordionContent = "",
				bodyObject = articleObject.blocks,
				blockType = articleObject.blockType,
				positions =
					articleObject.positions === undefined
						? null
						: articleObject.positions,
				itemIsLock =
					calculationForm.length &&
					calculationForm.get(0).notFullFunctionality &&
					!articleObject.trialAccess,
				emptySectionText = bodyObject === null || bodyObject.length === 0

			if (positions !== null && blockType !== "health") {
				var positionsJoin = ""

				for (var i = 0; i < positions.length; i++) {
					positionsJoin += positions[i].join(",")

					if (i !== positions.length - 1) {
						positionsJoin += ","
					}
				}

				positions = positionsJoin
			}

			if (emptySectionText) return

			switch (blockType) {
				case "forecast":
					accordionContent += createForecastSlider(
						sortedForecastArray,
						currentAge,
						language
					)[0]
					accordionContent += createForecastSlider(
						sortedForecastArray,
						currentAge,
						language
					)[1]

					accordionItem = buildAccordionItem(
						title,
						accordionContent,
						index,
						"calculation",
						itemIsLock,
						language,
						blockType
					)

					break
				case "health":
					accordionContent += createSubAccordion(
						bodyObject,
						blockType,
						blockType,
						index,
						language,
						positions
					)

					accordionItem = buildAccordionItem(
						title,
						accordionContent,
						index,
						"calculation",
						itemIsLock,
						language,
						blockType
					)

					break
				default:
					var resultWithAboveTitle =
						calculationForm.attr("data-result-type") === "with-above-title"

					if (resultWithAboveTitle) {
						for (var i = 0; i < bodyObject.length; i++) {
							var titleOfSection = bodyObject[i].title,
								textOfSectionOriginal = bodyObject[i].content,
								textOfSection = textFormatting(textOfSectionOriginal)

							accordionContent = ""

							if (calculationForm.hasClass("js-compatibility-form") || calculationForm.hasClass("js-compatibility-home-form")) {
								if (index === 0 && i === 0) {
									itemIsLock = false
								} else {
									itemIsLock =
										calculationForm.length &&
										calculationForm.get(0).notFullFunctionality
								}
							}

							accordionContent += '<div class="accordion__body-item">'
							if (textOfSectionOriginal.length) {
								accordionContent += textOfSection
							}
							accordionContent += "</div>"

							if (i === 0) {
								accordionItem =
									'<h5 class="mt-4">' +
									title +
									"</h5>" +
									buildAccordionItem(
										titleOfSection,
										accordionContent,
										index + "-" + i,
										"calculation",
										itemIsLock,
										language,
										blockType
									)
							} else {
								accordionItem += buildAccordionItem(
									titleOfSection,
									accordionContent,
									index + "-" + i,
									"calculation",
									itemIsLock,
									language,
									blockType
								)
							}
						}
					} else {
						for (var i = 0; i < bodyObject.length; i++) {
							var titleOfSection = bodyObject[i].title,
								textOfSectionOriginal = bodyObject[i].content,
								textOfSection = textFormatting(textOfSectionOriginal)

							accordionContent += '<div class="accordion__body-item">'
							if (titleOfSection.length && title !== titleOfSection) {
								accordionContent += "<h5>" + titleOfSection + "</h5>"
							}
							if (textOfSectionOriginal.length) {
								accordionContent += textOfSection
							}
							accordionContent += "</div>"

							accordionItem = buildAccordionItem(
								title,
								accordionContent,
								index,
								"calculation",
								itemIsLock,
								language,
								blockType,
								positions
							)
						}
					}

					break
			}

			return accordionItem
		}

		function createInfoFromServer(
			dataJson,
			calculationWrap,
			language,
			currentAge
		) {
			var sortedForecastArray = getSortedForecast(dataJson),
			calculationAccordion = calculationWrap.find(
				".js-calculation-accordion"
				),
				calculationForm = calculationWrap.find(".js-form-with-calculation")

				if(!calculationForm.length) {
					calculationForm = $(document.querySelector('.active.js-form-with-calculation'))
				}
				
			for (var i = 0; i < dataJson.data.length; i++) {
				var accordionItem = createAccordionItem(
					dataJson.data[i],
					i,
					language,
					sortedForecastArray,
					currentAge,
					calculationForm
				)

				calculationAccordion.append(accordionItem)

				if (dataJson.data[i].blockType === "forecast") initForecastSlider()
			}

			initPopovers()
		}

		function loadScript(src) {
			var themePath = $("body").attr("data-theme-path"),
				script = document.createElement("script")

			script.src = themePath + src
			script.async = false
			document.body.append(script)
		}

		// diagram
		function fillInTheDiagram(combinations, sectionWithDiagram) {
			var personalCalculationItems = sectionWithDiagram.find(
				".js-personal-calculation-item"
			)

			personalCalculationItems.each(function () {
				var personalCalculationPosition = $(this).attr(
					"data-personal-calculation-position"
				)

				$(this).text(combinations[personalCalculationPosition])
			})
		}

		function clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
			sectionWithDiagram
				.find(".js-personal-calculation-item")
				.removeClass("-active")
		}

		function addActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
			sectionWithDiagram
				.find(".js-personal-calculation-item")
				.addClass("-active")
		}

		function clearActiveRowInTable(sectionWithDiagram) {
			sectionWithDiagram
				.find(".js-health-table tbody tr")
				.removeClass("-active")
		}

		function activeArticleInTheSectionWithDiagram(
			sectionWithDiagram,
			calculationWrap
		) {
			calculationWrap
				.find("#calculation-accordion")
				.on("shown.bs.collapse", function (e) {
					clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
					clearActiveRowInTable(sectionWithDiagram)

					var activeAccordionItem = $(e.target).closest(".js-accordion-item"),
						activeAccordionItemName = activeAccordionItem
							.find(".accordion__btn")
							.text(),
						activeAccordionItemType =
							activeAccordionItem.attr("data-block-type"),
						positionsOfActiveAccordion = activeAccordionItem
							.attr("data-personal-calculation-positions")
							.replace(/\s/g, "")
							.split(",")

					if (
						activeAccordionItem.hasClass("-lock") ||
						positionsOfActiveAccordion[0] === "null"
					) {
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						return
					}

					for (var i = 0; i < positionsOfActiveAccordion.length; i++) {
						var position = positionsOfActiveAccordion[i],
							targetItem = sectionWithDiagram.find(
								'.js-personal-calculation-item[data-personal-calculation-position="' +
								position +
								'"]'
							),
							targetItemInTable = targetItem.closest(".js-health-table").length
								? true
								: false

						targetItem.addClass("-active")

						if (
							targetItemInTable &&
							(activeAccordionItemType === "health" ||
								activeAccordionItemName === "Программы" ||
								activeAccordionItemName === "Programs")
						) {
							targetItem.closest("tr").addClass("-active")
						}
					}
				})

			calculationWrap
				.find("#calculation-accordion")
				.on("hide.bs.collapse", function (e) {
					addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
					clearActiveRowInTable(sectionWithDiagram)
				})
		}

		function cloneDiagramSection(calculationWrap) {
			var diagram = calculationWrap.find(".js-section-with-diagram"),
				cloneWrapTarget = calculationWrap.find(".js-print-diagram-wrap")

			cloneWrapTarget.find(".js-section-with-diagram").remove()
			diagram
				.clone()
				.removeClass(".js-personal-calculation-item")
				.appendTo(cloneWrapTarget)
		}
		// helper functions END

		$(".js-check-date-home-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = $(document.querySelector(".home-result.js-calculation-wrap")),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveInfoButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formName = form.find("#name").val(),
					formDobArray = form.find("#dob").val().split("."),
					formDob =
						formDobArray[0] + "." + formDobArray[1] + "." + formDobArray[2],
					age = getAgeFromBirthdate(formDob),
					appeal = form.find("#appeal").val() || 'p',
					gender = form.find("#gender").val() || document.querySelector('input[name="gender"]:checked').value,
					product_id = +form.find("#product_id").val(),
					language = form.find("#language").val() || 'en',
					queryString =
						formDob +
						"?gender=" +
						gender +
						"&language=" +
						language +
						"&appeal=" +
						appeal

				saveInfoButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveInfoButton.attr("data-name-string", formName)
				saveInfoButton.attr("data-dob-string", formDob)
				saveInfoButton.attr("data-age-string", age)
				saveInfoButton.attr("data-language-string", language)

				saveDiagramButton.attr("data-name-string", formName)
				saveDiagramButton.attr("data-dob-string", formDob)
				saveDiagramButton.attr("data-language-string", language)

				$('.accordion.js-calculation-accordion').html('')
				$('.js-calculation-wrap > div').addClass('d-none')

				showPreloader(calculationWrap)

				$(this).get(0).notFullFunctionality = true
				
				$.ajax({
					url: API_CHECKDATE + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)
						
						
						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}
						
						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true
							
							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}
						
						calculationWrap.find(".js-calculation-begin").addClass("d-none")
						calculationWrap.find(".js-calculation-block").removeClass("d-none")
						calculationWrap
							.find(".js-calculation-block")
							.find(".js-name-and-dob")
							.text(formName + " (" + formDob + ")")

						// accordion
						createInfoFromServer(response, calculationWrap, language, age)

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						clearActiveRowInTable(sectionWithDiagram)

						fillInTheDiagram(response.combinations, sectionWithDiagram)
						activeArticleInTheSectionWithDiagram(
							sectionWithDiagram,
							calculationWrap
						)

						cloneDiagramSection(calculationWrap)

						// js-calculation-wrap
						const resultBlock = document.getElementById('resultBlock');
						if(resultBlock) {
							const elementPosition = resultBlock.getBoundingClientRect().top + window.pageYOffset - 150;
							window.scrollTo({ top: elementPosition, behavior: 'smooth' });
						}

						setTimeout(function () {
							hidePreloader(calculationWrap)
						}, 1000)
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})

		$(".js-compatibility-home-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = $(document.querySelector(".home-result.js-calculation-wrap")),
					saveButton = calculationWrap.find(".js-save-info-in-pdf"),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveInfoButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formDobOneArray = form.find("#dob-compatibility-1").val().split("."),
					formDobOne =
						formDobOneArray[0] +
						"." +
						formDobOneArray[1] +
						"." +
						formDobOneArray[2],
					formDobTwoArray = form.find("#dob-compatibility-2").val().split("."),
					formDobTwo =
						formDobTwoArray[0] +
						"." +
						formDobTwoArray[1] +
						"." +
						formDobTwoArray[2],
					language = form.find("#language-compatibility").val() || 'en',
					product_id = +form.find("#product_id").val(),
					queryString =
						"date1=" +
						formDobOne +
						"&date2=" +
						formDobTwo +
						"&language=" +
						language
                        
				saveButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveButton.attr("data-dob-string", formDobOne)
				saveButton.attr("data-dob-2-string", formDobTwo)
				saveButton.attr("data-language-string", language)

				$('.accordion.js-calculation-accordion').html('')
				$('.js-calculation-wrap > div').addClass('d-none')

				showPreloader(calculationWrap)

				$.ajax({
					url: API_COMPATIBILITY + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)

						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}

						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true

							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}

						calculationWrap.find(".js-calculation-comp-block").removeClass("d-none")

						createInfoFromServer(response, calculationWrap, language, 0)

						// js-calculation-wrap
						const resultBlock = document.getElementById('resultBlock');
						if(resultBlock) {
							const elementPosition = resultBlock.getBoundingClientRect().top + window.pageYOffset - 150;
							window.scrollTo({ top: elementPosition, behavior: 'smooth' });
						}

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						clearActiveRowInTable(sectionWithDiagram)

						fillInTheDiagram(response.combinations, sectionWithDiagram)
						activeArticleInTheSectionWithDiagram(
							sectionWithDiagram,
							calculationWrap
						)

						cloneDiagramSection(calculationWrap)

						$('.js-calculation-header-sub-title').text(formDobOne + ' + ' + formDobTwo)

						setTimeout(function () {
							hidePreloader(calculationWrap)
						}, 1000)
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})

		$(".js-kid-home-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = $(document.querySelector(".home-result.js-calculation-wrap")),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveInfoButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formName = form.find("#name").val(),
					formDobArray = form.find("#dob").val().split("."),
					formDob =
						formDobArray[0] + "." + formDobArray[1] + "." + formDobArray[2],
					age = getAgeFromBirthdate(formDob),
					appeal = form.find("#appeal").val() || 'p',
					gender = form.find("#gender").val() || document.querySelector('input[name="gender"]:checked').value,
					product_id = +form.find("#product_id").val(),
					language = form.find("#language").val() || 'en',
					queryString =
						formDob +
						"?gender=" +
						gender +
						"&language=" +
						language +
						"&appeal=" +
						appeal

				saveInfoButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveInfoButton.attr("data-name-string", formName)
				saveInfoButton.attr("data-dob-string", formDob)
				saveInfoButton.attr("data-age-string", age)
				saveInfoButton.attr("data-language-string", language)

				saveDiagramButton.attr("data-name-string", formName)
				saveDiagramButton.attr("data-dob-string", formDob)
				saveDiagramButton.attr("data-language-string", language)

				$('.accordion.js-calculation-accordion').html('')
				$('.js-calculation-wrap > *').addClass('d-none')

				showPreloader(calculationWrap)

				$(this).get(0).notFullFunctionality = true
				
				$.ajax({
					url: API_KID + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)
						
						
						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}
						
						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true
							
							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}
						
						calculationWrap.find(".js-calculation-begin").addClass("d-none")
						calculationWrap.find(".js-calculation-block").removeClass("d-none")
						calculationWrap
							.find(".js-calculation-block")
							.find(".js-name-and-dob")
							.text(formName + " (" + formDob + ")")

						// accordion
						createInfoFromServer(response, calculationWrap, language, age)

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						clearActiveRowInTable(sectionWithDiagram)

						fillInTheDiagram(response.combinations, sectionWithDiagram)
						activeArticleInTheSectionWithDiagram(
							sectionWithDiagram,
							calculationWrap
						)

						cloneDiagramSection(calculationWrap)

						// js-calculation-wrap
						const resultBlock = document.getElementById('resultBlock');
						if(resultBlock) {
							const elementPosition = resultBlock.getBoundingClientRect().top + window.pageYOffset - 150;
							window.scrollTo({ top: elementPosition, behavior: 'smooth' });
						}

						setTimeout(function () {
							hidePreloader(calculationWrap)
						}, 1000)
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})

		$(".js-check-date-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = form.closest(".js-calculation-wrap"),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveInfoButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formName = form.find("#name").val(),
					formDobArray = form.find("#dob").val().split("."),
					formDob =
						formDobArray[0] + "." + formDobArray[1] + "." + formDobArray[2],
					age = getAgeFromBirthdate(formDob),
					appeal = form.find("#appeal").val() || 'p',
					gender = form.find("#gender").val() || document.querySelector('input[name="gender"]:checked').value,
					product_id = +form.find("#product_id").val(),
					language = form.find("#language").val() || 'en',
					queryString =
						formDob +
						"?gender=" +
						gender +
						"&language=" +
						language +
						"&appeal=" +
						appeal

				saveInfoButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveInfoButton.attr("data-name-string", formName)
				saveInfoButton.attr("data-dob-string", formDob)
				saveInfoButton.attr("data-age-string", age)
				saveInfoButton.attr("data-language-string", language)

				saveDiagramButton.attr("data-name-string", formName)
				saveDiagramButton.attr("data-dob-string", formDob)
				saveDiagramButton.attr("data-language-string", language)

				showPreloader(calculationWrap)

				$.ajax({
					url: API_CHECKDATE + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)

						
						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}
						
						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true
							
							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}
						
						calculationWrap.find(".js-calculation-begin").addClass("d-none")
						calculationWrap.find(".js-calculation-block").removeClass("d-none")
						calculationWrap
							.find(".js-calculation-block")
							.find(".js-name-and-dob")
							.text(formName + " (" + formDob + ")")

						// accordion
						createInfoFromServer(response, calculationWrap, language, age)

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						clearActiveRowInTable(sectionWithDiagram)

						fillInTheDiagram(response.combinations, sectionWithDiagram)
						activeArticleInTheSectionWithDiagram(
							sectionWithDiagram,
							calculationWrap
						)

						cloneDiagramSection(calculationWrap)

						setTimeout(function () {
							// $('.js-save-info-in-pdf').click()
							hidePreloader(calculationWrap)
						}, 1000)
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})

		$(".js-compatibility-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = form.closest(".js-calculation-wrap"),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formDobOneArray = form.find("#dob-compatibility-1").val().split("."),
					formDobOne =
						formDobOneArray[0] +
						"." +
						formDobOneArray[1] +
						"." +
						formDobOneArray[2],
					formDobTwoArray = form.find("#dob-compatibility-2").val().split("."),
					formDobTwo =
						formDobTwoArray[0] +
						"." +
						formDobTwoArray[1] +
						"." +
						formDobTwoArray[2],
					language = form.find("#language-compatibility").val(),
					product_id = +form.find("#product_id").val(),
					queryString =
						"date1=" +
						formDobOne +
						"&date2=" +
						formDobTwo +
						"&language=" +
						language
                        
				saveButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveButton.attr("data-dob-string", formDobOne)
				saveButton.attr("data-dob-2-string", formDobTwo)
				saveButton.attr("data-language-string", language)

				showPreloader(calculationWrap)

				$.ajax({
					url: API_COMPATIBILITY + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)

						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}

						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true

							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}

						calculationWrap.find(".js-calculation-begin").addClass("d-none")
						calculationWrap.find(".js-calculation-block").removeClass("d-none")

						createInfoFromServer(response, calculationWrap, language, 0)

						setTimeout(function () {
							// $('.js-save-info-in-pdf').click()
							hidePreloader(calculationWrap)
						}, 1000)

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
						clearActiveRowInTable(sectionWithDiagram);

						fillInTheDiagram(response.combinations, sectionWithDiagram);
						activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);

						cloneDiagramSection(calculationWrap);

						$('.js-calculation-header-sub-title').text(formDobOne + ' + ' + formDobTwo)

						setTimeout(function () {
							scrollToBeginOfCalculation(calculationWrap);
							hidePreloader();
						}, 1000);
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})
		
		$(".js-kid-form").validate({
			submitHandler: function (form) {
				var form = $(form),
					calculationWrap = form.closest(".js-calculation-wrap"),
					sectionWithDiagram = calculationWrap.find(".js-section-with-diagram"),
					saveInfoButton = calculationWrap.find(".js-save-info-in-pdf"),
					saveDiagramButton = calculationWrap.find(".js-save-diagram-in-pdf"),
					formName = form.find("#name").val(),
					formDobArray = form.find("#dob").val().split("."),
					formDob =
						formDobArray[0] + "." + formDobArray[1] + "." + formDobArray[2],
					age = getAgeFromBirthdate(formDob),
					appeal = form.find("#appeal").val() || 'p',
					gender = form.find("#gender").val() || document.querySelector('input[name="gender"]:checked').value,
					product_id = +form.find("#product_id").val(),
					language = form.find("#language").val() || 'en',
					queryString =
						formDob +
						"?gender=" +
						gender +
						"&language=" +
						language +
						"&appeal=" +
						appeal

				saveInfoButton.attr("data-query-string", queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''))
				saveInfoButton.attr("data-name-string", formName)
				saveInfoButton.attr("data-dob-string", formDob)
				saveInfoButton.attr("data-age-string", age)
				saveInfoButton.attr("data-language-string", language)

				saveDiagramButton.attr("data-name-string", formName)
				saveDiagramButton.attr("data-dob-string", formDob)
				saveDiagramButton.attr("data-language-string", language)

				showPreloader(calculationWrap)

				$.ajax({
					url: API_KID + queryString + (location.pathname.startsWith('/my-account/') ? '&edw=1' : ''),
					method: "GET",
					success: function (response) {
						resetForm(form)

						
						if (product_id) {
							fetch("/wp-json/c/v1/deactivate/" + product_id)
						}
						
						if (!$("body").get(0).pdfScriptsInit) {
							$("body").get(0).pdfScriptsInit = true
							
							loadScript("/js/pdfmake.min.js")
							loadScript("/js/vfs_fonts.js")
						}
						
						calculationWrap.find(".js-calculation-begin").addClass("d-none")
						calculationWrap.find(".js-calculation-block").removeClass("d-none")
						calculationWrap
							.find(".js-calculation-block")
							.find(".js-name-and-dob")
							.text(formName + " (" + formDob + ")")

						// accordion
						createInfoFromServer(response, calculationWrap, language, age)

						// diagram
						addActiveArticleInTheSectionWithDiagram(sectionWithDiagram)
						clearActiveRowInTable(sectionWithDiagram)

						fillInTheDiagram(response.combinations, sectionWithDiagram)
						activeArticleInTheSectionWithDiagram(
							sectionWithDiagram,
							calculationWrap
						)

						cloneDiagramSection(calculationWrap)

						setTimeout(function () {
							// $('.js-save-info-in-pdf').click()
							hidePreloader(calculationWrap)
						}, 1000)
					},

					error: function () {
						console.log("some error occurred")
					},
				})
			},
		})

		$(".js-start-from-the-beginning").on("click", function () {
			window.location.reload()
		})
	}

	// SAVE PDF
	function createInformationPdf(
		response,
		calculationForm,
		typeOfDocument,
		language,
		dob,
		name,
		age,
		dob2
	) {
		console.log('1427 response - ', response)
		var dataJson = response.data,
			title = "",
			personalRecommendationsTitle = ""

		if (language === "ru") {
			if (typeOfDocument === "check-date") {
				title = "Информация о вас"
				personalRecommendationsTitle = "Личные рекомендации"
			} else if (typeOfDocument === "compatibility") {
				title = "Ваша совместимость"
			}
		} else if (language === "en") {
			if (typeOfDocument === "check-date") {
				title = "Information about you"
				personalRecommendationsTitle = "Personal recommendations"
			} else if (typeOfDocument === "compatibility") {
				title = "Your compatibility"
			}
		}

		var docInfo = {
			info: {
				title: title,
				// author: "https://matritsa-sudbi.ru",
				subject: title,
				keywords: "Матрица судьбы, Расчёт матрицы",
			},
		}

		var styles = {
			topTitle: {
				fontSize: 30,
				bold: true,
			},
			nameTitle: {
				fontSize: 18,
				bold: true,
			},
			title: {
				fontSize: 24,
				bold: true,
			},
			subTitle: {
				fontSize: 16,
				bold: true,
			},
			subSmallTitle: {
				fontSize: 14,
				bold: true,
			},
		}

		var content = []

		var topTitleObj = {
			text: title + ":\n\n",
			style: "topTitle",
		}

		content.push(topTitleObj)

		if (typeOfDocument === "check-date") {
			var nameAndDateObj = {
				text: name + " (" + dob + ")" + "\n\n\n\n",
				style: "nameTitle",
			}

			content.push(nameAndDateObj)
		} else if (typeOfDocument === "compatibility") {
			var datesObj = {
				text: dob + " + " + dob2 + "\n\n\n\n",
				style: "nameTitle",
			}

			content.push(datesObj)
		}

		console.log('1504', dataJson)

		for (var i = 0; i < dataJson.length; i++) {
			var blockType = dataJson[i].blockType,
				notFullFunctionality =
					calculationForm.length && calculationForm.get(0).notFullFunctionality,
				itemIsLock =
					dataJson[i].trialAccess === undefined
						? false
						: !dataJson[i].trialAccess,
				emptySectionText =
					dataJson[i].blocks === null || dataJson[i].blocks.length === 0,
				notSuitableAge = blockType === "forecast" && (age < 20 || age > 80),
				titleObj = {
					text: dataJson[i].title + "\n\n",
					style: "title",
				}

			if (emptySectionText || notSuitableAge) continue
			if (calculationForm.hasClass("js-compatibility-form")) {
				if (notFullFunctionality && i > 0) continue
			} else {
				if (notFullFunctionality && itemIsLock) continue
			}

			for (var j = 0; j < dataJson[i].blocks.length; j++) {
				if (typeOfDocument === "compatibility" && notFullFunctionality) {
					var firstItem = false

					if (i === 0 && j === 0) {
						firstItem = false
					} else {
						firstItem = true
					}

					if (firstItem) continue
				}

				if (j === 0) {
					content.push(titleObj)
				}

				var subTitleObj,
					text,
					subTitlepersonalRecommendationsObj,
					personalRecommendationsText

				if (blockType === "forecast") {
					if (dataJson[i].blocks[j].title.indexOf(age.toString()) !== -1) {
						subTitleObj = {
							text: dataJson[i].blocks[j].title + "\n\n",
							style: "subTitle",
						}

						text =
							dataJson[i].blocks[j].content.trim().replace(/\n+/g, "\n\n") +
							"\n\n\n\n"

						content.push(subTitleObj)
						content.push(text)
					}
				} else if (blockType === "health") {
					subTitleObj = {
						text: dataJson[i].blocks[j].title + "\n\n",
						style: "subTitle",
					}

					text =
						dataJson[i].blocks[j].content.trim().replace(/\n+/g, "\n\n") +
						"\n\n\n\n"

					subTitlepersonalRecommendationsObj = {
						text: personalRecommendationsTitle + "\n\n",
						style: "subSmallTitle",
					}

					personalRecommendationsText =
						dataJson[i].blocks[j].additional.personalRecommendations
							.trim()
							.replace(/\n+/g, "\n\n") + "\n\n\n\n"

					if (dataJson[i].blocks[j].title.length) {
						content.push(subTitleObj)
					}

					if (dataJson[i].blocks[j].content.length) {
						content.push(text)
					}

					if (dataJson[i].blocks[j].additional.personalRecommendations.length) {
						content.push(subTitlepersonalRecommendationsObj)
						content.push(personalRecommendationsText)
					}
				} else {
					subTitleObj = {
						text: dataJson[i].blocks[j].title + "\n\n",
						style: "subTitle",
					}

					text =
						dataJson[i].blocks[j].content.trim().replace(/\n+/g, "\n\n") +
						"\n\n\n\n"

					if (
						dataJson[i].blocks[j].title.length &&
						dataJson[i].title !== dataJson[i].blocks[j].title
					) {
						content.push(subTitleObj)
					}

					if (dataJson[i].blocks[j].content.length) {
						content.push(text)
					}
				}
			}
		}

		var futureArticle = {
			pageSize: "A4",
		}

		futureArticle.info = docInfo
		futureArticle.content = content
		futureArticle.styles = styles

		var pdf = pdfMake.createPdf(futureArticle)
		var pdf_2 = pdfMake.createPdf(futureArticle)
		let promiseObject = pdf_2.getBase64((base64Data) => {
		});


			let newpdflog = "";
			if (typeOfDocument === "check-date") {
				newpdflog = name + " (" + dob + ").pdf";
			} else if (typeOfDocument === "compatibility") {
				newpdflog = dob + " + " + dob2 + ".pdf";
			}
			promiseObject.then(function (result) {
				$.ajax({
					type: 'POST',
					url: '/upload.php',
					dataType: 'html',          /* Тип данных в ответе (xml, json, script, html). */
					data: {
						text: result,
						name: newpdflog,
						user: jQuery(".info_js_thank").attr('data-user'),
						userid: jQuery(".js-form-with-calculation").attr('data-user-id'),
						click: jQuery(".js-form-with-calculation").attr('data-click'),
						type: jQuery(".js-form-with-calculation").attr('data-type'),
						// product: jQuery(".info_js_thank").attr('data-product')
					}
				});
			});

			pdf.download(newpdflog);

	}

	function createDiagramPdf(language, dob, name, diagramImage) {
		var title = ""

		if (language === "ru") {
			title = "Диаграмма"
		} else if (language === "en") {
			title = "Diagram"
		}

		var docInfo = {
			info: {
				title: title,
				// author: "https://matritsa-sudbi.ru",
				subject: title,
				keywords: "Destiny Matrix, Matrix Calculation",
			},
		}

		var styles = {
			topTitle: {
				fontSize: 18,
				bold: true,
			},
		}

		var content = []

		var topTitleObj = {
			text: title + ": " + name + " (" + dob + ")" + "\n\n",
			style: "topTitle",
			alignment: "center",
		}

		content.push(topTitleObj)

		content.push({
			image: diagramImage,
			fit: [780, 500],
			alignment: "center",
		})

		var diagramPdf = {
			pageSize: "A4",
			pageMargins: [20, 20],
			pageOrientation: "landscape",
			content: [],
		}

		diagramPdf.info = docInfo
		diagramPdf.content = content
		diagramPdf.styles = styles

		pdfMake.createPdf(diagramPdf).download("" + title.toLowerCase() + ".pdf")
	}

	function detectTypeOfDocument(form) {
		var typeOfDocument = ""

		switch (true) {
			case form.hasClass("js-check-date-form"):
				typeOfDocument = "check-date"

				break

			case form.hasClass("js-compatibility-form"):
				typeOfDocument = "compatibility"

				break
			
			case form.hasClass("js-kid-form"):
				typeOfDocument = "kid"

				break
		}

		return typeOfDocument
	}

	function savePdfOnClick() {
		$(".js-save-info-in-pdf").on("click", function (e) {
			e.preventDefault()

			var calculationWrap = $(this).closest(".js-calculation-wrap"),
				calculationForm = calculationWrap.find(".js-form-with-calculation"),
				typeOfDocument = detectTypeOfDocument(calculationForm),
				apiUrl = "",
				queryString = $(this).attr("data-query-string"),
				language = $(this).attr("data-language-string"),
				dob = $(this).attr("data-dob-string"),
				name,
				age,
				dob2

			showPreloader(calculationWrap)

			if (typeOfDocument === "check-date") {
				apiUrl = API_CHECKDATE
				name = $(this).attr("data-name-string")
				age = $(this).attr("data-age-string")
			} else if (typeOfDocument === "compatibility") {
				apiUrl = API_COMPATIBILITY
				dob2 = $(this).attr("data-dob-2-string")
			} else if (typeOfDocument === "kid") {
				apiUrl = API_KID
				name = $(this).attr("data-name-string")
				age = $(this).attr("data-age-string")
			}

			$.ajax({
				url: apiUrl + queryString,
				method: "GET",
				success: function (response) {
					createInformationPdf(
						response,
						calculationForm,
						typeOfDocument,
						language,
						dob,
						name,
						age,
						dob2
					)

					setTimeout(function () {
						hidePreloader(calculationWrap)
					}, 1000)
				},

				error: function () {
					console.log("some error occurred")
				},
			})
		})

		$(".js-save-diagram-in-pdf").on("click", function (e) {
			e.preventDefault()

			var calculationWrap = $(this).closest(".js-calculation-wrap"),
				language = $(this).attr("data-language-string"),
				dob = $(this).attr("data-dob-string"),
				name = $(this).attr("data-name-string"),
				printDiagramHtml = calculationWrap.find(
					".js-print-diagram-wrap .js-section-with-diagram"
				)

			showPreloader(calculationWrap)

			domtoimage
				.toJpeg(printDiagramHtml.get(0), { bgcolor: "#ffffff" })
				.then(function (dataUrl) {
					createDiagramPdf(language, dob, name, dataUrl)

					setTimeout(function () {
						hidePreloader(calculationWrap)
					}, 1000)
				})
				.catch(function (error) {
					console.error("oops, something went wrong!", error)
				})
		})
	}

	// SCROLL AFTER ACCORDION CLICK
	function initAccordionScroll() {
		$("body").on(
			"click",
			".js-calculation-accordion .js-accordion-item.-with-collapse .accordion__btn",
			function () {
				var accordionBtn = $(this)

				setTimeout(function () {
					$("html, body").animate(
						{
							scrollTop:
								accordionBtn.closest(".js-accordion-item").offset().top - 100,
						},
						300
					)
				}, 100)
			}
		)

		// hide second level accordions
		$(".js-calculation-accordion").on("hidden.bs.collapse", function () {
			$(this).find(".js-second-level-accordion .collapse").collapse("hide")
		})
	}

	// VIDEO THUMBNAIL
	function detectVideoHosting(url) {
		var videoHosting = ""

		if (url.indexOf("youtube") >= 0) {
			videoHosting = "youtube"
		} else if (url.indexOf("vimeo") >= 0) {
			videoHosting = "vimeo"
		}

		return videoHosting
	}

	function getVideoId(videoItem) {
		var videoThumbnailUrl = videoItem.attr("data-video"),
			videoHosting = detectVideoHosting(videoThumbnailUrl),
			separator = ""

		if (videoHosting === "youtube") {
			separator = "v="
		} else if (videoHosting === "vimeo") {
			separator = "/"
		}

		return videoThumbnailUrl.split(separator)[
			videoThumbnailUrl.split(separator).length - 1
		]
	}

	function initInsertVideoIframe() {
		$(".js-video-thumbnail").on("click", function () {
			var videoHosting = detectVideoHosting($(this).attr("data-video")),
				videoIframe = $(
					'<iframe class="video-thumbnail__media" allowfullscreen></iframe>'
				)
			videoIframe.attr("allow", "autoplay")

			if (videoHosting === "youtube") {
				videoIframe.attr(
					"src",
					"https://www.youtube.com/embed/" +
					getVideoId($(this)) +
					"?rel=0&showinfo=0&autoplay=1"
				)
			} else if (videoHosting === "vimeo") {
				videoIframe.attr(
					"src",
					"https://player.vimeo.com/video/" +
					getVideoId($(this)) +
					"?autoplay=1"
				)
			}

			$(this).find(".js-video-thumbnail-media").remove()
			$(this).append(videoIframe)
		})
	}

	// REVIEWS SLIDER
	function initReviewsSlider() {
		var reviewsSlider = $(".js-reviews-slider")

		reviewsSlider.slick({
			arrows: false,
			dots: true,
			adaptiveHeight: true,
			draggable: false,
		})

		$(".js-prev-slide").on("click", function (e) {
			e.preventDefault()

			reviewsSlider.slick("slickPrev")
		})

		$(".js-next-slide").on("click", function (e) {
			e.preventDefault()

			reviewsSlider.slick("slickNext")
		})
	}

	// SCROLL TO ELEMENT
	function initScrollToElement() {
		var animationComplete = true

		$('a[href^="#"]:not([href="#"])').on("click", function () {
			if ($(this).closest(".lwptoc").length) return

			var idOfElement = $(this).attr("href"),
				top = $(idOfElement).offset().top

			if (animationComplete) {
				animationComplete = false

				$("body, html")
					.animate(
						{
							scrollTop: top,
						},
						1000
					)
					.promise()
					.done(function () {
						animationComplete = true
					})
			}
		})
	}

	// POPOVERS
	function initPopovers() {
		function calculationAccordionPopover() {
			var calculationAccordionPopoverSelector = $(
				'.js-calculation-accordion [data-toggle="popover"]'
			),
				hideTimeout

			calculationAccordionPopoverSelector.popover({
				trigger: "hover | focus",
				placement: "right",
				offset: "0, -100% + 50px",
			})

			calculationAccordionPopoverSelector.on("shown.bs.popover", function (e) {
				clearTimeout(hideTimeout)

				hideTimeout = setTimeout(function () {
					$(e.target).popover("hide")
				}, 2000)
			})
		}

		calculationAccordionPopover()

		$(".js-popover").popover({
			trigger: "hover | focus",
			placement: "right",
			offset: "0, 20px",
		})
	}

	// REMOVE PRODUCT LINKS IN ACCOUNT
	function initRemoveLinksFromProductsInSubscription() {
		function replaceLinkWithText(link) {
			link.each(function () {
				var text = $(this).text()

				$(this).parent().html(text)
			})
		}

		replaceLinkWithText($(".ywsbs-subscription-product a"))
		replaceLinkWithText($(".product-name a"))
	}

	// INIT FORECAST SLIDER
	function initForecastSlider() {
		var initialSlide = 0

		$(".js-slider-forecast-years .forecast-years-item").each(function (index) {
			if ($(this).hasClass("-active")) {
				initialSlide = index
			}
		})

		if ($(".js-slider-forecast-years").length) {
			$(".js-slider-forecast-years").slick({
				slidesToShow: 3,
				asNavFor: ".js-slider-forecast-text",
				arrows: false,
				centerMode: true,
				centerPadding: "0",
				focusOnSelect: true,
				initialSlide: initialSlide,
				mobileFirst: true,
				swipeToSlide: true,
				responsive: [
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 5,
						},
					},
				],
			})
		}

		if ($(".js-slider-forecast-text").length) {
			$(".js-slider-forecast-text").slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				fade: true,
				swipe: false,
				asNavFor: ".js-slider-forecast-years",
				initialSlide: initialSlide,
				adaptiveHeight: true,
			})
		}
	}

	// INIT REDIRECT FOR RENEW PRO SUBSCRIBE
	function initRedirectForRenewProSubscribe() {
		if (
			$(".woocommerce-view-subscription .renew-subscription-button").length &&
			$(
				".woocommerce-view-subscription .shop_table.order_details tbody .product-name"
			)
				.text()
				.indexOf("PRO") !== -1
		) {
			$(".woocommerce-view-subscription .renew-subscription-button").after(
				"<a class='button' href='" +
				window.location.origin +
				"/my-account/renew-subscription/'>Renew subscription</a>"
			)
			$(".woocommerce-view-subscription .renew-subscription-button").remove()
		}
	}

	// INIT MONTH PRICE
	function initAddMonthPrice() {
		var switchVariationSelect = $("#switch-variation")

		switchVariationSelect.find("option").each(function () {
			var option = $(this),
				optionText = option.text(),
				splitedOptionText = optionText.split(" "),
				price = 0,
				period = splitedOptionText[splitedOptionText.length - 1],
				periodLength = splitedOptionText[splitedOptionText.length - 2].length
					? +splitedOptionText[splitedOptionText.length - 2]
					: 1,
				monthPrice = 0

			// remove original price (if there is a discount)
			function removeOriginalPrice(array) {
				var arrayOfPricePosition = []

				for (var i = 0; i < array.length; i++) {
					if (splitedOptionText[i].indexOf("$") > -1) {
						arrayOfPricePosition.push(i)
					}
				}

				if (arrayOfPricePosition.length > 1) {
					splitedOptionText.splice(arrayOfPricePosition[0], 1)
				}
			}

			removeOriginalPrice(splitedOptionText)

			for (var i = 0; i < splitedOptionText.length; i++) {
				if (splitedOptionText[i].indexOf("$") > -1) {
					price = splitedOptionText[i].slice(0, -1)
					splitedOptionText[i] = " - " + splitedOptionText[i]
				}
			}

			optionText = splitedOptionText.join(" ")

			switch (true) {
				case period.indexOf("month") !== -1 && periodLength > 1:
					monthPrice = price / periodLength
					monthPrice = Math.trunc(monthPrice)

					option.text(
						optionText.split("/")[0] + "(" + monthPrice + "$ per month)"
					)

					break

				case period === "month" && periodLength === 1:
					option.text(optionText.split("/")[0])

					break

				case periodLength === 999:
					option.text(optionText.split("/")[0])

					break

				case period.indexOf("year") !== -1:
					monthPrice = price / (periodLength * 12)
					monthPrice = Math.trunc(monthPrice)

					option.text(
						optionText.split("/")[0] + "(" + monthPrice + "$ per month)"
					)

					break
			}
		})
	}

	// INIT СORRECTION UNLIMITED PLAN
	function initСorrectionUnlimitedPlan() {
		$(".ywsbs-item").each(function () {
			if (
				$(this).find(".ywsbs-subscription-recurring").text().indexOf("999") > -1
			) {
				$(this).find(".ywsbs-subscription-recurring").html("no")
				$(this).find(".ywsbs-subscription-payment-date").html("no")
			}
		})

		$(".woocommerce-MyAccount-content p").each(function () {
			if (
				$(this).find(".woocommerce-Price-amount").length &&
				$(this).text().indexOf("999") > -1
			) {
				$(this).find(".woocommerce-Price-amount").get(0).nextSibling.nodeValue =
					"forever"
				$(this).find(".woocommerce-Price-amount").remove()

				$(this)
					.find("strong")
					.each(function () {
						if ($(this).get(0).nextSibling.nodeValue.indexOf(".") > -1) {
							if (
								+$(this).get(0).nextSibling.nodeValue.trim().split(".").pop() >
								3000
							) {
								$(this).get(0).nextSibling.nodeValue = "no"
							}
						}
					})

				if ($("form #switch-variation").length) {
					$("form #switch-variation")
						.closest("form")
						.prevAll("h4")
						.first()
						.remove()
					$("form #switch-variation").closest("form").remove()
				}
			}
		})
	}

	// INITIALIZE FIXED BLOCKS ON SCROLL
	function initStickyScrollBlock() {
		$(".woocommerce-MyAccount-navigation").hcSticky({
			top: 120,
			mobileFirst: true,
			disable: true,
			responsive: {
				768: {
					disable: false,
				},
			},
		})
	}

	// REMOVE CRITICAL CSS
	function removeCriticalCss() {
		if ($("#critical-css").length) {
			setTimeout(function () {
				$("#critical-css").remove()
			}, 5000)
		}
	}

	// INIT COUNTDOWN
	function initCountDown() {
		if ($(".js-countdown").length) {
			function getDateAndTimeString(date) {
				var dd = String(date.getDate()).padStart(2, "0"),
					mm = String(date.getMonth() + 1).padStart(2, "0"),
					yyyy = date.getFullYear(),
					h = date.getHours(),
					m = date.getMinutes(),
					s = date.getSeconds()

				var dateString = yyyy + "/" + mm + "/" + dd,
					timeString = h + ":" + m + ":" + s,
					dateAndTimeString = dateString + " " + timeString

				return dateAndTimeString
			}

			function getTargetDate(daysOffset) {
				var targetDate = new Date(
					Date.now() + daysOffset * 24 * 60 * 60 * 1000
				),
					targetDateAndTimeString

				if (!Cookies.get("targetDate")) {
					targetDateAndTimeString = getDateAndTimeString(targetDate)
					Cookies.set("targetDate", targetDateAndTimeString, { expires: 365 })
				} else {
					targetDateAndTimeString = Cookies.get("targetDate")
				}

				return targetDateAndTimeString
			}

			function plural(number, variants) {
				var idx = 2
				if (number % 10 === 1 && number % 100 !== 11) {
					idx = 0
				} else if (
					number % 10 >= 2 &&
					number % 10 <= 4 &&
					(number % 100 < 10 || number % 100 >= 20)
				) {
					idx = 1
				}
				return variants[idx]
			}

			$(".js-countdown").each(function () {
				var $countdown = $(this),
					daysOffset = $countdown.attr("data-offset"),
					targetDate = getTargetDate(daysOffset),
					lang = $("html").attr("lang"),
					langIsRussian = lang.indexOf("ru") >= 0

				$countdown.countdown(targetDate)

				$countdown.on("update.countdown", function (event) {
					var daysPlural = langIsRussian
						? plural(event.offset.days, ["день", "дня", "дней"])
						: "day%!D",
						hoursPlural = langIsRussian
							? plural(event.offset.hours, ["час", "часа", "часов"])
							: "hour%!H",
						minutesPlural = langIsRussian
							? plural(event.offset.minutes, ["минута", "минуты", "минут"])
							: "minute%!M",
						secondsPlural = langIsRussian
							? plural(event.offset.seconds, ["секунда", "секунды", "секунд"])
							: "second%!S"

					$countdown.html(
						event.strftime(
							"" +
							'<div class="countdown__item"><span class="countdown__digit">%d</span><span class="countdown__label">' +
							daysPlural +
							"</span></div>" +
							'<div class="countdown__item"><span class="countdown__digit">%H</span><span class="countdown__label">' +
							hoursPlural +
							"</span></div>" +
							'<div class="countdown__item"><span class="countdown__digit">%M</span><span class="countdown__label">' +
							minutesPlural +
							"</span></div>" +
							'<div class="countdown__item"><span class="countdown__digit">%S</span><span class="countdown__label">' +
							secondsPlural +
							"</span></div>"
						)
					)
				})

				$countdown.on("finish.countdown", function (event) {
					Cookies.remove("targetDate")

					var newTargetDate = getTargetDate(daysOffset)

					$countdown.countdown(newTargetDate)
				})
			})
		}
	}

	for(let i = 1; i < 20; i++) {
		for(let a = 1; a < 20; a++) {
			$('.about_text' + i + 's' + a).css('display', 'none');
			$('#about_button' + i).click(function () {
				$('.about_text' + i + 's' + a).css('display', 'block');
				$('#about_button' + i).css('display', 'none');
				$('#font-weight-light' + i).css('margin-bottom', '50px');
			});
		}
	}



})(jQuery)