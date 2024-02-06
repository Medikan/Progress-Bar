import { LightningElement, api } from 'lwc'
import { FlowNavigationNextEvent } from 'lightning/flowSupport'

/**
 * Progress Bar component for Screen Flows
 *
 * @prop pageNames
 * @prop currentPage
 * @prop visitedPages
 * @prop completedPages
 * @prop allowSkippingPages
 */
export default class App extends LightningElement {
	@api pageNames
	@api currentPage
	@api visitedPages
	@api completedPages
	@api allowSkippingPages

	_pageNavigation

	@api get pageNavigation() {
		return this._pageNavigation
	}

	/**
	 * Hack to hold the current iteration of the loop to display progress bar elements.
	 * Needed to conditionally add/remove certain properties
	 */
	currentPageOfForLoop = 0

	/**
	 * Optional. Creates an array out of the passed in comma separated list and uses it for progress bar section names
	 */
	get pageNamesArray() {
		return this.pageNames?.split(',') ?? []
	}

	/**
	 * Gets the label for the progress bar section. Either the name of the page from the passed in property or returns the page number
	 */
	get label() {
		return (
			this.pageNamesArray[this.currentPageOfForLoop - 1] ??
			this.currentPageOfForLoop
		)
	}

	/**
	 * Optional. Creates an array out the the passed-in comma separated list
	 */
	get visitedPagesArray() {
		return this.visitedPages?.split(',') ?? []
	}

	/**
	 * Optional. Creates an array out of the passed-in comma separated list
	 */
	get completedPagesArray() {
		return this.completedPages?.split(',') ?? []
	}

	/**
	 * This keeps track of the current loop so we can know when to decorate the buttons for the current page. Nice little hack...
	 */
	get incrementIndexTracker() {
		this.currentPageOfForLoop++
		return 0
	}

	/**
	 * Assigns appropriate classes to progress bar items
	 */
	get progressBarItemClasses() {
		let classes = 'slds-path__item'

		if (this.isCurrentPage) classes += ' slds-is-current slds-is-active'
		else if (this.isCompletedPage) classes += ' slds-is-complete'
		else classes += ' slds-is-incomplete'

		if (
			!this.allowSkippingPages &&
			!this.isVisitedPage &&
			!this.isCompletedPage &&
			!this.isCurrentPage
		)
			classes += ' disabled'

		return classes
	}

	/**
	 * Checks if the current progress bar item iteration is for the current page
	 */
	get isCurrentPage() {
		const currentPageIndex = this.pageNamesArray.indexOf(this.currentPage)
		return Number(this.currentPageOfForLoop) === currentPageIndex
	}

	/**
	 * Checks if the current progress bar item iteration is for a visited page
	 */
	get isVisitedPage() {
		return this.visitedPagesArray.some(
			(page) => page === this.pageNamesArray[this.currentPageOfForLoop],
		)
	}

	/**
	 * Checks if the current progress bar item iteration is for previous pages
	 */
	get isBeforeCurrentPage() {
		const currentPageIndex = this.pageNamesArray.indexOf(this.currentPage)
		return Number(this.currentPageOfForLoop) < currentPageIndex
	}

	/**
	 * Checks if the current progress bar item iteration is for a completed pages
	 */
	get isCompletedPage() {
		return this.completedPagesArray.some(
			(page) => page === this.pageNamesArray[this.currentPageOfForLoop],
		)
	}

	/**
	 * Sets the value later used for navigation in the decision flow element
	 *
	 * @param {*} event
	 * Make sure the element calling this contains the data-page attribute with the desired page navigation as the value
	 */
	setPageNavigation(event) {
		let targetPage = event.currentTarget.dataset.page

		// Do nothing if user hasn't visited/completed the page and the admin doesn't want the user skipping to unvisited pages
		if (
			!this.allowSkippingPages &&
			(this.visitedPagesArray.indexOf(targetPage) === -1 ||
				this.completedPagesArray.indexOf(targetPage) === -1)
		) {
			return
		}

		this._pageNavigation = targetPage
		this.navigateToNextPage()
	}

	/**
	 * Salesforce boilerplate to trigger next-page navigation on flows
	 */
	navigateToNextPage() {
		const navigateNextEvent = new FlowNavigationNextEvent()
		this.dispatchEvent(navigateNextEvent)
	}
}
