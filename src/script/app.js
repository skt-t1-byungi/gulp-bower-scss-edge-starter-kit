(function () {
  'use strict';

  // @include ./_common.js

  // @include ./_custom-select.js

  // flag select box
  $('.i18n-select').customSelect({
    invisibleTextClass: 'i18n-select__text--hidden',
    activeDropdownClass: 'i18n-select__dropdown--active',
    inactiveDropdownClass: 'i18n-select__dropdown--hidden'
  });
})();
