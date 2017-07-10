/**
 * Copyright 2015-2017 Flavio Garcia
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

steal("can-jquery", "can-component", "can-connect", "can-connect/constructor",
    "can-connect/data/url", "can-define/map", "can-define/list", "can-event",
    "can-fixture/fixture.js", "can-set/src/set.js", "./searchbox.stache",
    function($, Component, connect, constructor, dataUrl, DefineMap,
             DefineList, can_event, fixture, set, template) {
    fixture({
        "GET /contact/search": "/assets/fixtures/search/results.json"
    });

    var searchConnection = connect([constructor, dataUrl], {
        url: "/contact/search"
    });

    var SearchResult = DefineMap.extend({
        id: "number",
        img: "string",
        label: "string"
    });

    var SearchResultList = DefineList.extend({
        "#": SearchResult
    });

    var NavSearchViewModel = DefineMap.extend("NavSearchViewModel", {
        error: 'boolean',
        results: 'observable',
        hasResults: 'boolean',
        isLoading: 'boolean',
        previousValue: 'string',
        searched: 'boolean'
    });

    Component.extend({
        tag: "nav-search-box",
        view: template,
        ViewModel: NavSearchViewModel.extend({
            error: {value: false},
            hasResults: {value: false},
            results: {value: []},
            isLoading: {value: true},
            previousValue: {value: ""},
            searched: {value: false},
            showSearchDropdown: function (searchQuery, event) {
                var previousValue = this.previousValue;
                this.previousValue = searchQuery.val();
                if(searchQuery.val().length > 0) {
                    searchQuery.parent().addClass("open");
                    if(previousValue != searchQuery.val()) {
                        if(!this.hasResults) {
                            this.searched = false;
                        }
                        this.isLoading = true;
                        this.search(searchQuery.val());
                    }
                    steal.dev.log("The search query size is bigger than 0." +
                        "Showing the dropdwon.");
                }
                else{
                    this.searched = false;
                    searchQuery.parent().removeClass("open");
                    this.isLoading = false;
                    steal.dev.log("The search query size is smaller than 1. " +
                        "Not showing the dropdwon.");
                }
            },
            search: function (criteria) {
                searchConnection.getList({criteria: criteria}).then(
                    function(results){
                        this.results = results;
                        this.searched = true;
                        this.isLoading = false;
                        this.hasResults = true;
                    }.bind(this));
            },
            setLoading: function(loading){
                this.isLoading = loading;
            }
        }),
        events: {
            "inserted": function(searchComponent, event) {
                steal.dev.log("Started");
            },
            "#searchComponent focus": function(searchComponent, event) {
                steal.dev.log("Focused on the search Component!");
            },
            "#searchQueryButton click": function() {
                can_event.trigger.call($("#searchQuery")[0], "click");
                steal.dev.log("Clicked on the search query button!");
                return false;
            },
            "#searchDropdownMenu click": function() {
                can_event.trigger.call($("#searchQuery")[0], "click");
                steal.dev.log("Clicked on the dropdown menu!");
                return false;
            },
            "#searchQuery click": function(searchQuery, event, buga) {
                can_event.trigger.call(searchQuery, "keyup");
                steal.dev.log("Clicked on the search query input!");
                return false;
            },
            "#searchQuery keyup": function(searchQuery, event) {
                searchQuery = $(searchQuery);
                this.viewModel.showSearchDropdown(searchQuery, event);
                return false;
            }
        }
    });
});
