import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

/**
 * Progress Bar component for Screen Flows
 * 
 * @prop pageNames
 * @prop currentPage
 * @prop completedPages
 */
export default class App extends LightningElement {
    @api pageNames;
    @api currentPage;
    @api completedPages;

    _pageNavigation;

    @api get pageNavigation() {
        return this._pageNavigation;
    }

    /**
     * Hack to hold the current iteration of the loop to display progress bar elements.
     * Needed to conditionally add/remove certain properties
     */
    currentPageOfForLoop = 0;

    /**
     * Optional. Creates an array out of the passed in comma separated list and uses it for progress bar section names
     */
    get pageNamesArray() {
        return this.pageNames?.split(',') ?? [];
    }

    /**
     * Gets the label for the progress bar section. Either the name of the page from the passed in property or returns the page number
     */
    get label() {
        return this.pageNamesArray[this.currentPageOfForLoop - 1] ?? this.currentPageOfForLoop;
    }

    /**
     * Optional. Creates an array out of the passed-in comma separated list
     */
    get completedPagesArray() {
        return this.completedPages?.split(',') ?? [];
    }

    /**
    * This keeps track of the current loop so we can know when to decorate the buttons for the current page. Nice little hack...
    */
    get incrementIndexTracker() {
        this.currentPageOfForLoop++;
        return 0;
    }

    /**
     * Assigns appropriate classes to progress bar items
     */
    get progressBarItemClasses() {
        let classes = 'progress-bar-item';

        if (this.isCurrentPage) classes += ' current-page';
        else if (this.isBeforeCurrentPage) classes += ' previous-page';
        else classes += ' future-page';

        if (this.isCompletedPage) classes += ' completed-page';

        return classes;
    }

    /**
     * Checks if the current progress bar item iteration is for the current page
     */
    get isCurrentPage() {
        const currentPageIndex = this.pageNamesArray.indexOf(this.currentPage);
        return Number(this.currentPageOfForLoop) === currentPageIndex;
    }

    /**
     * Checks if the current progress bar item iteration is for previous pages
     */
    get isBeforeCurrentPage() {
        const currentPageIndex = this.pageNamesArray.indexOf(this.currentPage);
        return Number(this.currentPageOfForLoop) < currentPageIndex;
    }

    /**
     * Checks if the current progress bar item iteration is for a completed pages
     */
    get isCompletedPage() {
        return this.completedPagesArray.some(page => page === this.pageNamesArray[this.currentPageOfForLoop]);
    }

    /**
     * Sets the value later used for navigation in the decision flow element
     * 
     * @param {*} event
     * Make sure the element calling this contains the data-page attribute with the desired page navigation as the value 
     */
    setPageNavigation(event) {
        this._pageNavigation = event.currentTarget.dataset.page;
        this.navigateToNextPage();
    }

    /**
     * Salesforce boilerplate to trigger next-page navigation on flows
     */
    navigateToNextPage() {
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }

}