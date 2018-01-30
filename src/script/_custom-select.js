(function () {
  $.fn.customSelect = function (option) {
    option = $.extend({
      // defaults
      prefix: 'custom-',
      selectedClass: 'selected',
      unselectedClass: '',
      visibleTextClass: 'visible',
      invisibleTextClass: '',
      activeDropdownClass: 'active',
      inactiveDropdownClass: '',
      onChange: $.noop
    }, option);

    this.each(function () {
      var $customSelect = $(this);
      var $customTexts = $customSelect.find('[data-' + option.prefix + 'text]');
      var $dropdown = $customSelect.find('[data-' + option.prefix + 'options]');
      var $customOptions = $dropdown.find('[data-' + option.prefix + 'value]');

      // default values
      var name = $customSelect.data(option.prefix + 'name');
      var values = $customOptions
        .map(function () {
          return $(this).data(option.prefix + 'value');
        })
        .toArray();

      // state
      var isActiveDropdown = false;
      var selectedValue = $customOptions.filter('[data-' + option.prefix + 'selected]').val() || values[0];

      /**
       * $(..).val(), $(..).serialize() 할 경우 값을 추가하기 위한 용도의 select element
       */
      var $select = createSelectEl(name, values).appendTo($customSelect).val(selectedValue);

      // events
      $customSelect.click(function (e) {
        if ($dropdown.has(e.target).length === 0) {
          isActiveDropdown = !isActiveDropdown;
          renderDropdown();
        }
      });

      $customOptions.click(function () {
        var $selected = $(this);
        var value = $selected.data(option.prefix + 'value');

        if (isActiveDropdown) {
          isActiveDropdown = false;
          renderDropdown();
        }

        if (value === selectedValue) {
          return;
        }

        selectedValue = value;
        $select.val(selectedValue).change();
        option.onChange.call($customSelect[0], selectedValue);

        renderText();
      });

      $(document).click(function (e) {
        if ($customSelect.has(e.target).length === 0 && isActiveDropdown) {
          isActiveDropdown = false;
          renderDropdown();
        }
      });

      // init render
      renderText();
      renderDropdown();

      function renderText () {
        var $selected = $customTexts.filter('[data-' + option.prefix + 'text=' + selectedValue + ']');
        var $others = $customTexts.not($selected);

        $selected.addClass(option.visibleTextClass).removeClass(option.invisibleTextClass);
        $others.addClass(option.invisibleTextClass).removeClass(option.visibleTextClass);
      }

      function renderDropdown () {
        // disabled
        if (!isActiveDropdown) {
          $dropdown.addClass(option.inactiveDropdownClass).removeClass(option.activeDropdownClass);
          return;
        }

        // enabled
        var $selected = $customTexts.filter('[data-' + option.prefix + 'text=' + selectedValue + ']');
        var $others = $customTexts.not($selected);

        $selected.addClass(option.selectedClass).removeClass(option.unselectedClass);
        $others.addClass(option.unselectedClass).removeClass(option.selectedClass);

        $dropdown.addClass(option.activeDropdownClass).removeClass(option.inactiveDropdownClass);
      }
    });

    return this;
  };

  function createSelectEl (name, values) {
    return $(document.createElement('select'), {name: name})
      .html(
        values.map(function (value) {
          return '<option value="' + value + '">' + value + '</option>';
        })
      ).hide();
  }
})();
