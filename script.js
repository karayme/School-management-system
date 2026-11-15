

document.addEventListener("DOMContentLoaded", function () {

    setupMobileMenu();
    setupStudentManagement();
    setupContactForm();

});



//   1. MOBILE NAVIGATION MENU

function setupMobileMenu() {

    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener("click", function () {

        const isOpen = navbar.classList.toggle("show");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.textContent = isOpen ? "✕" : "☰";

    });

    const navLinks = navbar.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navbar.classList.remove("show");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";

        });

    });

}



   // 2. STUDENT MANAGEMENT SYSTEM

function setupStudentManagement() {

    // Array of objects to store student records
    let students = [];

    let nextStudentId = 1;

    let currentSearch = "";

    const studentForm = document.querySelector(".form form");
    const studentTable = document.getElementById("studentTable");

    if (!studentForm || !studentTable) return;

    // Form inputs
    const nameInput = document.getElementById("name");
    const ageInput = document.getElementById("age");
    const genderInput = document.getElementById("gender");
    const courseInput = document.getElementById("course");
    const marksInput = document.getElementById("marks");

    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchBtn");
    const clearSearchButton = document.getElementById("clearSearch");

    const noRecords = document.getElementById("noRecords");

    const updateForm = document.getElementById("updateMarksForm");
    const deleteForm = document.getElementById("deleteStudentForm");

    const updateStudentSelect = document.getElementById("updateStudent");
    const deleteStudentSelect = document.getElementById("deleteStudent");

    const managementMessage = document.getElementById("managementMessage");




    //   STUDENT REGISTRATION
    

    studentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearFormMessages();

        const name = nameInput.value.trim();
        const age = Number(ageInput.value);
        const gender = genderInput.value;

        const course = courseInput.options[
            courseInput.selectedIndex
        ]?.text.trim() || "";

        const marks = Number(marksInput.value);


        // Validate required fields
        if (
            !name ||
            !ageInput.value ||
            !gender ||
            !course ||
            !marksInput.value
        ) {

            showFormMessage(
                "Please fill in all the student details.",
                "error"
            );

            return;

        }


        // Validate age
        if (
            !Number.isFinite(age) ||
            age < 1 ||
            age > 120
        ) {

            showFormMessage(
                "Please enter a valid age between 1 and 120.",
                "error"
            );

            ageInput.focus();

            return;

        }


        // Validate marks
        if (
            !Number.isFinite(marks) ||
            marks < 0 ||
            marks > 100
        ) {

            showFormMessage(
                "Marks must be between 0 and 100.",
                "error"
            );

            marksInput.focus();

            return;

        }


        // Create a student object
        const student = {

            id: nextStudentId++,
            name: name,
            age: age,
            gender: gender,
            course: course,
            marks: marks

        };


        // Add student to array
        students.push(student);


        // Clear registration form
        studentForm.reset();


        showFormMessage(
            name + " has been registered successfully.",
            "success"
        );


        // Refresh website information
        renderAll();

    });



    
    //   DISPLAY SUCCESS AND ERROR MESSAGES
    

    function showFormMessage(message, type) {

        const target = type === "error"
            ? errorMessage
            : successMessage;

        if (target) {
            target.textContent = message;
        }

        const other = type === "error"
            ? successMessage
            : errorMessage;

        if (other) {
            other.textContent = "";
        }

    }


    function clearFormMessages() {

        if (errorMessage) {
            errorMessage.textContent = "";
        }

        if (successMessage) {
            successMessage.textContent = "";
        }

    }


    //   PERFORMANCE CLASSIFICATION
    

    function getPerformance(marks) {

        if (marks >= 80) {
            return "Excellent";
        }

        else if (marks >= 70) {
            return "Very Good";
        }

        else if (marks >= 60) {
            return "Good";
        }

        else if (marks >= 50) {
            return "Average";
        }

        else {
            return "Failed";
        }

    }


    function getPerformanceClass(marks) {

        return marks < 50 ? "failed" : "passed";

    }



    
    //   DISPLAY STUDENT RECORDS
    

    function renderStudents() {

        studentTable.replaceChildren();

        // Search students by name
        const visibleStudents = students.filter(function (student) {

            return student.name
                .toLowerCase()
                .includes(currentSearch);

        });


        visibleStudents.forEach(function (student) {

            const row = document.createElement("tr");


            // Student information
            const details = [

                student.name,
                student.age,
                student.gender,
                student.course,
                student.marks

            ];


            details.forEach(function (value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });


            // Performance column
            const performanceCell = document.createElement("td");

            const performanceLabel = document.createElement("span");

            performanceLabel.textContent =
                getPerformance(student.marks);

            performanceLabel.className =
                getPerformanceClass(student.marks);

            performanceCell.appendChild(performanceLabel);

            row.appendChild(performanceCell);


            // Delete button
            const actionsCell = document.createElement("td");

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";

            deleteButton.textContent = "Delete";

            deleteButton.className = "delete-btn";


            deleteButton.addEventListener("click", function () {

                deleteStudent(student.id);

            });


            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);


            // Add row to table
            studentTable.appendChild(row);

        });


        // Display message when there are no records
        if (noRecords) {

            noRecords.textContent = students.length === 0
                ? "No student records available."
                : visibleStudents.length === 0
                    ? "No matching student was found."
                    : "";

            noRecords.style.display =
                visibleStudents.length === 0 ? "block" : "none";

        }

    }




     //  DASHBOARD STATISTICS

    function renderStatistics() {

        const total = students.length;

        const passed = students.filter(function (student) {

            return student.marks >= 50;

        }).length;


        const failed = total - passed;


        let average = 0;

        if (total > 0) {

            const totalMarks = students.reduce(function (sum, student) {

                return sum + student.marks;

            }, 0);

            average = totalMarks / total;

        }


        setText("totalStudents", total);

        setText("passedStudents", passed);

        setText("failedStudents", failed);

        setText("averageMarks", average.toFixed(1));

    }


    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {

            element.textContent = value;

        }

    }



    
    //   UPDATE AND DELETE STUDENT OPTIONS

    function renderManagementOptions() {

        if (!updateStudentSelect || !deleteStudentSelect) {
            return;
        }


        [updateStudentSelect, deleteStudentSelect].forEach(
            function (select) {

                const previousValue = select.value;

                select.replaceChildren();


                const defaultOption =
                    document.createElement("option");

                defaultOption.value = "";

                defaultOption.textContent = "Select Student";

                select.appendChild(defaultOption);


                students.forEach(function (student) {

                    const option =
                        document.createElement("option");

                    option.value = String(student.id);

                    option.textContent =
                        student.name + " (" + student.course + ")";

                    select.appendChild(option);

                });


                if (
                    students.some(function (student) {
                        return String(student.id) === previousValue;
                    })
                ) {

                    select.value = previousValue;

                }

            }
        );

    }



    
    //   REFRESH ALL WEBSITE INFORMATION 

    function renderAll() {

        renderStudents();

        renderStatistics();

        renderManagementOptions();

    }



    //DELETE STUDENT 

    function deleteStudent(studentId) {

        const student = students.find(function (item) {

            return item.id === studentId;

        });


        if (!student) return;


        const confirmation = window.confirm(
            "Are you sure you want to delete " +
            student.name + "'s record?"
        );


        if (!confirmation) return;


        students = students.filter(function (item) {

            return item.id !== studentId;

        });


        if (managementMessage) {

            managementMessage.textContent =
                student.name + "'s record has been deleted.";

            managementMessage.className = "success-message";

        }


        renderAll();

    }



    //UPDATE STUDENT MARKS 

    if (updateForm) {

        updateForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const studentId = Number(updateStudentSelect.value);

            const newMarksInput =
                document.getElementById("newMarks");

            const newMarks = Number(newMarksInput.value);


            if (
                !studentId ||
                !newMarksInput.value ||
                !Number.isFinite(newMarks) ||
                newMarks < 0 ||
                newMarks > 100
            ) {

                showManagementMessage(
                    "Select a student and enter marks from 0 to 100.",
                    "error"
                );

                return;

            }


            const student = students.find(function (item) {

                return item.id === studentId;

            });


            if (!student) return;


            student.marks = newMarks;


            updateForm.reset();


            showManagementMessage(
                student.name + "'s marks have been updated.",
                "success"
            );


            renderAll();

        });

    }



    //DELETE STUDENT USING MANAGEMENT 

    if (deleteForm) {

        deleteForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const studentId = Number(deleteStudentSelect.value);


            if (!studentId) {

                showManagementMessage(
                    "Please select a student to delete.",
                    "error"
                );

                return;

            }


            deleteStudent(studentId);

            deleteForm.reset();

        });

    }



    function showManagementMessage(message, type) {

        if (!managementMessage) return;

        managementMessage.textContent = message;

        managementMessage.className =
            type === "error"
                ? "error-message"
                : "success-message";

    }



    // STUDENT SEARCH 

    function runSearch() {

        currentSearch = (searchInput?.value || "")
            .trim()
            .toLowerCase();

        renderStudents();

    }


    if (searchButton) {

        searchButton.addEventListener("click", runSearch);

    }


    if (searchInput) {

        searchInput.addEventListener("input", runSearch);


        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                runSearch();

            }

        });

    }



    // CLEAR SEARCH 

    if (clearSearchButton) {

        clearSearchButton.addEventListener("click", function () {

            if (searchInput) {

                searchInput.value = "";

            }

            currentSearch = "";

            renderStudents();

        });

    }



    // Display initial dashboard
    renderAll();

}



// CONTACT FORM VALIDATION

function setupContactForm() {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;


    const errorMessage = document.getElementById("errorMessage");

    const successMessage = document.getElementById("successMessage");


    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        if (errorMessage) {

            errorMessage.textContent = "";

        }

        if (successMessage) {

            successMessage.textContent = "";

        }


        const name = document.getElementById("fullName").value.trim();

        const email = document.getElementById("email").value.trim();

        const subject = document.getElementById("subject").value.trim();

        const message = document.getElementById("message").value.trim();



        // Check required fields
        if (!name || !email || !subject || !message) {

            showContactError("Please fill in all fields.");

            return;

        }



        // Validate email address
        const atPosition = email.indexOf("@");

        const dotPosition = email.lastIndexOf(".");


        if (
            atPosition < 1 ||
            dotPosition < atPosition + 2 ||
            dotPosition === email.length - 1
        ) {

            showContactError("Please enter a valid email address.");

            return;

        }



        // Validate message length
        if (message.length < 10) {

            showContactError(
                "Your message must contain at least 10 characters."
            );

            return;

        }



        // Display success message
        if (successMessage) {

            successMessage.textContent =
                "Thank you, your message has been received.";

            successMessage.className = "success-message";

        }


        // Clear form after successful submission
        contactForm.reset();

    });



    function showContactError(message) {

        if (errorMessage) {

            errorMessage.textContent = message;

            errorMessage.className = "error-message";

        }

    }

}
