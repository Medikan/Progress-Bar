import { createElement } from 'lwc'
import ProgressBar from 'c/progressBar'

import { FlowNavigationNextEvent } from 'lightning/flowSupport'

jest.mock('lightning/flowSupport', () => ({ FlowNavigationNextEvent: jest.fn }))

describe('c-progress-bar', () => {
	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild)
		}
	})

	it('should initialize', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		expect(1).toBe(1)
	})

	// Progress bar items are displayed correctly
	it('should display progress bar items correctly', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems =
			element.shadowRoot.querySelectorAll('.slds-path__item')
		expect(progressItems.length).toBe(pageNames.split(',').length)

		let currentPageIndex = pageNames.split(',').indexOf(currentPage)
		progressItems.forEach((item, index) => {
			let pageName = pageNames.split(',')[index]

			if (index === currentPageIndex) {
				expect(item.classList.contains('slds-is-current')).toBe(true)
			} else if (visitedPages.split(',').some((x) => x === pageName)) {
				expect(item.classList.contains('disabled')).toBe(false)
			}
		})
	})

	// Current page is highlighted
	it('should highlight current page', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems =
			element.shadowRoot.querySelectorAll('.slds-path__item')

		let currentPageIndex = pageNames.split(',').indexOf(currentPage)
		progressItems.forEach((item, index) => {
			if (index === currentPageIndex) {
				expect(item.classList.contains('slds-is-current')).toBe(true)
			} else {
				expect(item.classList.contains('slds-is-current')).toBe(false)
			}
		})
	})

	// Completed pages are highlighted
	it('should highlight completed pages', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems =
			element.shadowRoot.querySelectorAll('.slds-path__item')

		progressItems.forEach((item, index) => {
			let pageName = pageNames.split(',')[index]

			if (completedPages.split(',').some((x) => x === pageName)) {
				expect(item.classList.contains('slds-is-complete')).toBe(true)
			} else {
				expect(item.classList.contains('slds-is-complete')).toBe(false)
			}
		})
	})

	// Completed pages are highlighted
	it('should add disabled class to nonvisited pages', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		const allowSkippingPages = false

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
			allowSkippingPages: allowSkippingPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems =
			element.shadowRoot.querySelectorAll('.slds-path__item')

		progressItems.forEach((item, index) => {
			let pageName = pageNames.split(',')[index]

			if (
				visitedPages.split(',').some((x) => x === pageName) ||
				completedPages.split(',').some((x) => x === pageName) ||
				currentPage === pageName
			) {
				expect(item.classList.contains('disabled')).toBe(false)
			} else {
				expect(item.classList.contains('disabled')).toBe(true)
			}
		})
	})

	// numberOfPages is not provided
	it('should handle missing numberOfPages prop', () => {
		// Arrange
		const pageNames = null
		const currentPage = '3'
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems =
			element.shadowRoot.querySelectorAll('.slds-path__item')
		expect(progressItems.length).toBe(0)
	})

	// currentPage is not provided
	it('should handle missing currentPage prop', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = ''
		const completedPages = '1'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: completedPages,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems = element.shadowRoot.querySelectorAll(
			'.slds-path__item.slds-is-current',
		)
		expect(progressItems.length).toBe(0)
	})

	// completedPages is not provided
	it('should handle missing completedPages prop', () => {
		// Arrange
		const pageNames = '1,2,3,4,5'
		const currentPage = '3'
		const visitedPages = '2'

		// Act
		const element = createElement('c-progress-bar', {
			is: ProgressBar,
		})

		Object.assign(element, {
			pageNames: pageNames,
			currentPage: currentPage,
			completedPages: undefined,
			visitedPages: visitedPages,
		})

		document.body.appendChild(element)

		// Assert
		const progressItems = element.shadowRoot.querySelectorAll(
			'.slds-path__item.slds-is-complete',
		)
		expect(progressItems.length).toBe(0)
	})
})
