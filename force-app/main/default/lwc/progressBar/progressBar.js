import { LightningElement, api } from 'lwc';
import { FlowNavigationNextEvent } from 'lightning/flowSupport';

/**
 * Progress Bar component for Screen Flows
 * 
 * @prop numberOfPages
 * @prop currentPage
 * @prop completedPages
 */
export default class App extends LightningElement {
    @api numberOfPages;
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
     * Splits our numberOfPages into an iteratable array
     */
    get pagesArray() {
        return Array.from({ length: this.numberOfPages }, ((_, i) => i + 1));
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
    isCurrentPage() {
        const currentPage = Number(this.currentPage);
        return Number(this.currentPageOfForLoop) === currentPage;
    }

    /**
     * Checks if the current progress bar item iteration is for previous pages
     */
    isBeforeCurrentPage() {
        const currentPage = Number(this.currentPage);
        return Number(this.currentPageOfForLoop) < currentPage;
    }

    /**
     * Checks if the current progress bar item iteration is for a completed pages
     */
    isCompletedPage() {
        const currentPage = Number(this.currentPageOfForLoop);
        return this.completedPagesArray.some(page => Number(page) === currentPage);
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