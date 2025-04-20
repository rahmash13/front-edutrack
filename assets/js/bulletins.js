/**
 * Page User List
 */

'use strict';
$(function () {
    // Select2
    var select2 = $('.select2');
    const flatpickrDate = document.querySelector('#flatpickr-date');
    if (select2.length) {
      select2.each(function () {
        var $this = $(this);
        $this.wrap('<div class="position-relative"></div>').select2({
          dropdownParent: $this.parent(),
          placeholder: $this.data('placeholder') // for dynamic placeholder
        });
      });
    }

    if (flatpickrDate) {
        flatpickrDate.flatpickr({
          dateFormat: "Y",        // Show only the year in the input
          defaultDate: "today",   // Or set your preferred default year
          allowInput: true,       // Allows manual input
          onReady: function (selectedDates, dateStr, instance) {
            // Hide month and day elements
            instance.calendarContainer.querySelector(".flatpickr-months").style.display = "none";
            instance.calendarContainer.querySelector(".flatpickr-weekdays").style.display = "none";
            instance.calendarContainer.querySelector(".flatpickr-days").style.display = "none";
          }
        });
      }
})

  const data = {
    "2023": {
      "1": {
        "1A": ["Étudiant 1", "Étudiant 2"],
        "1B": ["Étudiant 3"]
      },
      "2": {
        "2A": ["Étudiant 4"],
        "2B": ["Étudiant 5", "Étudiant 6"]
      }
    },
    "2024": {
      "1": {
        "3A": ["Étudiant 7", "Étudiant 8"]
      }
    }
  };

  const subjects = ["Math", "Physique", "SVT", "Anglais"];

  function updateClasses() {
    const year = $('#select-year').val();
    const semester = $('#select-semester').val();
    const $classList = $('#class-list').empty();
    $('#student-list').empty();
    $('#notes-section').empty();

    if (data[year] && data[year][semester]) {
      $.each(data[year][semester], function(className) {
        const $link = $('<a href="#" class="list-group-item list-group-item-action"></a>')
          .text(className)
          .on('click', function(e) {
            e.preventDefault();
            loadStudents(year, semester, className);
          });
        $classList.append($link);
      });
    }
  }

  function loadStudents(year, semester, className) {
    const students = data[year][semester][className];
    const $studentList = $('#student-list').empty();
    $('#notes-section').empty();

    $.each(students, function(_, studentName) {
      const $link = $('<a href="#" class="list-group-item list-group-item-action"></a>')
        .text(studentName)
        .on('click', function(e) {
          e.preventDefault();
          loadNotesForm(studentName);
        });
      $studentList.append($link);
    });
  }

  function loadNotesForm(studentName) {
    const $notesSection = $('#notes-section').empty();
    $notesSection.append(`<div class="list-group-item active">${studentName} - Notes</div>`);
  
    subjects.forEach(subject => {
      const $row = $(`
        <div class="list-group-item note-row">
          <div class="row align-items-center">
            <div class="col-6 font-medium">${subject}</div>
            <div class="col-6">
              <input type="number" step="0.01" min="0" max="20" class="form-control form-control-sm note-input" placeholder="Note">
            </div>
          </div>
        </div>
      `);
      $notesSection.append($row);
    });
  
    // Moyenne display row
    const $moyenneRow = $(`
      <div class="list-group-item bg-light font-semibold">
        <div class="row align-items-center">
          <div class="col-6">Moyenne</div>
          <div class="col-6" id="moyenne-value">--</div>
        </div>
      </div>
    `);
    $notesSection.append($moyenneRow);
  
    // Event: recalculate moyenne when any note changes
    $('.note-input').on('input', function () {
      let total = 0;
      let count = 0;
  
      $('.note-input').each(function () {
        const val = parseFloat($(this).val());
        if (!isNaN(val) && val >= 0 && val <= 20) {
          total += val;
          count++;
        }
      });
  
      const moyenne = count > 0 ? (total / count).toFixed(2) : '--';
      $('#moyenne-value').text(moyenne);
    });
  }
  

  // Event listeners
  $(document).ready(function() {
    $('#select-year, #select-semester').on('change', updateClasses);
    updateClasses(); // Init on page load
  });

