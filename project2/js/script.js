const data = {
    people: [],
    locations: [],
    departments: []
};
let people = [];

class Loading {
    start(params) {
        $("#loading").show();
    }
    end() {
        $("#loading").hide();
    }
}
const loading = new Loading();

class ResultsBox {
    pass(title, text) {
        $("#resultsBox p").removeAttr("class");
        $("#resultsBox p").addClass("success");
        $("#resultsBox .modal-title").html(title);
        $("#resultsBox p").html(text);
        $("#resultsBox").modal("show");
    }
    fail(title, text) {
        $("#resultsBox p").removeAttr("class");
        $("#resultsBox p").addClass("fail");
        $("#resultsBox .modal-title").html(title);
        $("#resultsBox p").html(text);
        $("#resultsBox").modal("show");
    }
}
const resultsBox = new ResultsBox();


const setPeople = () => {
    loading.start();
    $("#results").html("");


    let peopleToShow = people;
    if ($("#location").val() !== "") {
        peopleToShow = peopleToShow.filter(person => person[6] == $("#location").val());
    }
    if ($("#department").val() !== "") {
        peopleToShow = peopleToShow.filter(person => person[5] == $("#department").val());
    }

    peopleToShow.forEach(person => {


        let dept = [];
        if (data.departments.filter(department => department[0] == person[5]).length > 0) {
            dept = data.departments.filter(department => department[0] == person[5])[0];
        }

        let loc = [];
        if (data.locations.filter(location => location[0] == dept[2]).length > 0) {
            loc = data.locations.filter(location => location[0] == dept[2])[0];
        }


        $("#results").append(`
<div class="row">
    <div class="resultsName"><h3><i class="fa-solid fa-person"></i> <span>${person[1]} ${person[2]}</span></h3></div>
    <div class="rowDetails"><i class="fa-solid fa-envelope"></i> <span>${person[4]}</span></div>
    <div class="rowDetails"><i class="fa-solid fa-book"></i> <span></span>${dept[1]}</div>
    <div class="rowDetails"><i class="fa-solid fa-location-crosshairs"></i> <span>${loc[1]}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${person[0]}" class="fa-solid fa-pen-to-square editPersonnelIcon"></i>
        <i id="${person[0]}" class="fa-solid fa-trash-can deleteIcon"></i>
        </div>
</div>`);



    });
    loading.end();
    $(".deleteIcon").on("click", e => {
        //.attr("employee")
        pId = e.target.id;
        deleteType = 0;
        $(".deleteType").html("employee");
        $("#confirmDelete").modal("show");
    });

    $(".editPersonnelIcon").on("click", e => {
        pId = e.target.id;
        //$("#locationInputUpdate").val(data.locations.filter(l=>l[0]==pId)[0][1]);
        $("#firstNameInputUpdate").val(data.people.filter(p => p[0] == pId)[0][1]);
        $("#lastNameInputUpdate").val(data.people.filter(p => p[0] == pId)[0][2]);
        $("#jobTitleInputUpdate").val(data.people.filter(p => p[0] == pId)[0][3]);
        $("#emailInputUpdate").val(data.people.filter(p => p[0] == pId)[0][4]);
        $("#updateNameSelectDepartment").html("");
        data.departments.forEach(d => {
            if (d[0] === data.people.filter(p => p[0] == pId)[0][5]) {
                $("#updateNameSelectDepartment").append(
                    `<option selected="true" value="${d[0]}">${d[1]}</option>`);
            } else {
                $("#updateNameSelectDepartment").append(
                    `<option  value="${d[0]}">${d[1]}</option>`);
            }

        });

        $("#updateEmployeeModal").modal("show");
    });

}

const setDepartments = () => {
    $(".departmentsSelect .depoption").remove();
    $("#resultsDepartments").html("");

    data.departments.forEach(department => {
        let loc = data.locations.filter(location => location[0] == department[2])[0];

        
        
        let numPeople = data.people.filter(p => p[5] == department[0]).length;
        
        $(".departmentsSelect").append(
            `<option class="depoption" value="${department[0]}">${department[1]}</option>`);

        $("#resultsDepartments").append(`
<div class="row">
    <div class="resultsName"><h3><i class="fa-solid fa-book"></i> <span>${department[1]}</span></h3></div>
    <div class="rowDetails"><i class="fa-solid fa-people-group"></i> <span>${numPeople}</span></div>
    <div class="rowDetails"><i class="fa-solid fa-location-crosshairs"></i> <span>${loc[1]}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${department[0]}" class="fa-solid fa-pen-to-square editDepartmentIcon"></i>
        <i id="${department[0]}" class="fa-solid fa-trash-can deleteDepartmentIcon"></i>
        </div>
</div>`);
    });
    $(".deleteDepartmentIcon").on("click", e => {
        pId = e.target.id;
        deleteType = 2;
        $(".deleteType").html("department");
        $("#confirmDelete").modal("show");
    });

    $(".editDepartmentIcon").on("click", e => {
        pId = e.target.id;
        $("#departmentInputUpdate").val(data.departments.filter(d => d[0] == pId)[0][1]);
        $("#departmentLocationIdSelectUpdate").html("");
        data.locations.forEach(l => {
            if (l[0] === data.departments.filter(d => d[0] == pId)[0][2]) {
                $(".locationsSelect").append(
                    `<option selected="true" value="${l[0]}">${l[1]}</option>`);
            } else {
                $(".locationsSelect").append(`<option  value="${l[0]}">${l[1]}</option>`);
            }

        });

        $("#updateDepartmentModal").modal("show");


    });

}
const setLocations = () => {
    $(".locationsSelect .locoption").remove();
    $("#resultsLocations").html("");
    data.locations.forEach(location => {
        const numDepartments = data.departments.filter(d => d[2] === location[0]).length;
        $(".locationsSelect").append(
            `<option class="locoption" value="${location[0]}">${location[1]}</option>`);

        $("#resultsLocations").append(`
<div class="row">
    <div class="resultsName"><h3><i class="fa-solid fa-location-crosshairs"></i> <span>${location[1]}</span></h3></div>
    <div class="rowDetails"><i class="fa-solid fa-book"></i> <span>${numDepartments}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${location[0]}" class="fa-solid fa-pen-to-square editLocationIcon"></i>
        <i id="${location[0]}" class="fa-solid fa-trash-can deleteLocationIcon"></i>
        </div>
</div>`);
    });

    $(".deleteLocationIcon").on("click", e => {
        pId = e.target.id;
        deleteType = 1;
        $(".deleteType").html("location");
        $("#confirmDelete").modal("show");


    });

    $(".editLocationIcon").on("click", e => {
        pId = e.target.id;
        deleteType = 1;
        $("#locationInputUpdate").val(data.locations.filter(l => l[0] == pId)[0][1]);
        $("#updateLocationModal").modal("show");
    });


}


let pId = "";
let deleteType = 0;

function confirmDelete() {

    loading.start();
    let url = "";
    if (deleteType === 0) {
        url = "php/person/delete.php";

    } else if (deleteType === 1) {
        url = "php/location/delete.php";
    } else if (deleteType === 2) {
        url = "php/department/delete.php";
    }
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        data: {
            id: pId
        },
        success: results => {

            if (results.status.name === "ok") {
                resultsBox.pass("Delete", "deleted succesfully");
                loadData();

            } else {
                resultsBox.fail("Delete", "failed to delete : " + results.status.description);
            }
            loading.end();
        },
        error: (error, status, errorType) => {
            resultsBox.fail("Delete", "failed to delete");
            loading.end();
        }

    });

}

function loadData(){
    loading.start();
    $.ajax({
        url: "php/loaddata.php",
        type: "GET",
        dataType: "json",
        success: (results) => {
            data.people = results.data[0];
            data.departments = results.data[2];
            data.locations = results.data[1];

            people = data.people;



            setLocations();
            setDepartments();
            setPeople();


        },
        error: (err, status, type) => {
            alert("error");
            loading.end();

        }
    });

}




$(document).ready(() => {

    loadData();

    $("#search").on("keyup", () => {

        var searchList = data.people.filter(person =>
            person[1].toLowerCase().includes($("#search").val().toLowerCase()) ||
            person[2].toLowerCase().includes($("#search").val().toLowerCase()));
        people = searchList;
        setPeople();

    });

    $("#location").on("change", () => {
        setPeople();
    });

    $("#department").on("change", () => {
        setPeople();
    });


    ////////// ADD / UPDATE Personnel ///////////

    /////Add New Personnel
    $("#addName").on("click", () => {
        if ($("#firstNameInput").val() === "") {
            resultsBox.fail("Add New Employee",
                "First Name Can Not be Empty");
            return;
        }
        if ($("#lastNameInput").val() === "") {
            resultsBox.fail("Add New Employee",
                "Last Name Can Not be Empty");
            return;
        }
        if ($("#jobTitleInput").val() === "") {
            resultsBox.fail("Add New Employee",
                "Job Title Can Not be Empty");
            return;
        }
        if ($("#emailInput").val() === "") {
            resultsBox.fail("Add New Employee",
                "Email Can Not be Empty");
            return;
        }
        if ($("#addNameSelectDepartment").val() === "") {
            resultsBox.fail("Add New Employee",
                "Select Department");
            return;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!$("#emailInput").val().match(mailformat)) {
            resultsBox.fail("Add New Employee",
                "Invalid email");
            return;

        }
        loading.start();
        $(".modal").modal("hide");

        $.ajax({
            url: "php/person/insert.php",
            type: "GET",
            dataType: "json",
            data: {
                firstname: $("#firstNameInput").val(),
                lastname: $("#lastNameInput").val(),
                departmentID: $("#addNameSelectDepartment").val(),
                jobTitle: $("#jobTitleInput").val(),
                email: $("#emailInput").val()

            },
            success: results => {
                loading.end();
                if (results.status.name === "ok") {
                    loadData();
                    resultsBox.pass("Add New Personnel",
                        "new personnel added successfully");
                    setPeople();
                    setDepartments();
                    setLocations();
                } else {
                    resultsBox.fail("Add New Personnel",
                        "failed to add new personnel");
                }
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Add New Personnel", "error : " + errorType)
            }

        });
    });


    /////Update Personnel
    $("#updateName").on("click", () => {
        if ($("#firstNameInputUpdate").val() === "") {
            resultsBox.fail("Update Employee",
                "First Name Can Not be Empty");
            return;
        }
        if ($("#lastNameInputUpdate").val() === "") {
            resultsBox.fail("Update Employee",
                "Last Name Can Not be Empty");
            return;
        }
        if ($("#jobTitleInputUpdate").val() === "") {
            resultsBox.fail("Update Employee",
                "Job Title Can Not be Empty");
            return;
        }
        if ($("#emailInputUpdate").val() === "") {
            resultsBox.fail("Update Employee",
                "Email Can Not be Empty");
            return;
        }
        if ($("#updateNameSelectDepartment").val() === "") {
            resultsBox.fail("Update Employee",
                "Select Department");
            return;
        }
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!$("#emailInputUpdate").val().match(mailformat)) {
            resultsBox.fail("Update Employee",
                "Invalid email");
            return;

        }
        loading.start();
        $(".modal").modal("hide");

        $.ajax({
            url: "php/person/update.php",
            type: "GET",
            dataType: "json",
            data: {
                firstname: $("#firstNameInputUpdate").val(),
                lastname: $("#lastNameInputUpdate").val(),
                departmentID: $("#updateNameSelectDepartment").val(),
                jobTitle: $("#jobTitleInputUpdate").val(),
                email: $("#emailInputUpdate").val(),
                id: pId

            },
            success: results => {
                loading.end();
                if (results.status.name === "ok") {
                    loadData();
                    resultsBox.pass("Update Personnel",
                        "personnel updated successfully");
                    setPeople();
                    setDepartments();
                    setLocations();
                } else {
                    resultsBox.fail("Update Personnel",
                        "failed to update personnel");
                }
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Update Personnel", "error : " + errorType)
            }

        });
    });

    ////////////////////////////////////////////

    ////////// ADD / UPDATE LOCATION ///////////

    ///Add new Location
    $("#addLocation").on("click", () => {
        if ($("#locationInput").val() === "") {
            resultsBox.fail("Add New Location",
                "Location Name Can Not be Empty");
            return;

        }
        $('.modal').modal('hide');
        loading.start();
        $.ajax({
            url: "php/location/insert.php",
            type: "GET",
            dataType: "json",
            data: {
                name: $("#locationInput").val()
            },
            success: results => {
                $("#locationInput").val("");
                $('.modal').modal('hide');
                if (results.status.name === "ok") {
                    loadData();
                    resultsBox.pass("Add New Location",
                        "new location added successfully");
                    setLocations();
                } else {
                    resultsBox.fail("Add New Location",
                        "failed to add new location");
                }

                loading.end();
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Add New Location", "error : " + errorType)
            }

        });
    });


    /////updateLocation
    $("#updateLocation").on("click", () => {
        if ($("#locationInputUpdate").val() === "") {
            resultsBox.fail("Add New Location",
               "Location Name Can Not be Empty");
            return;

        }
        $('.modal').modal('hide');
        loading.start();
        $.ajax({
            url: "php/location/update.php",
            type: "GET",
            dataType: "json",
            data: {
                name: $("#locationInputUpdate").val(),
                id: pId
            },
            success: results => {
                $("#locationInput").val("");
                if (results.status.name === "ok") {
                    loadData();
                    resultsBox.pass("Update Location",
                        "location updated successfully");
                    setLocations();
                } else {
                    resultsBox.fail("Update Location",
                        "failed to update location");
                }

                loading.end();
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Update Location", "error : " + errorType)
            }

        });
    });
    /////////////////////////////// 


    ////////// ADD / UPDATE DEPARTMENT ///////////

    ///Add new Department
    $("#addDepartment").on("click", () => {
        if ($("#departmentLocationIdSelect").val() === "") {
            resultsBox.fail("Add New Department",
                "Department Name Can Not be Empty");
            return;
        }
        if ($("#departmentLocationIdSelect").val() === "") {
            resultsBox.fail("Update Department",
                "Select Location");
            return;
        }
        loading.start();
        $('.modal').modal('hide');
        $.ajax({
            url: "php/department/insert.php",
            type: "GET",
            dataType: "json",
            data: {
                name: $("#departmentInput").val(),
                locationID: $("#departmentLocationIdSelect").val()
            },
            success: results => {
                $("#departmentInput").val("");

                if (results.status.name === "ok") { 
                    loadData();
                    resultsBox.pass("Add New Department",
                        "new department added succesfully");
                } else {
                    resultsBox.fail("Add New Department",
                        "failed to add new department");
                }

                loading.end();
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Add New Department",
                    "failed to add new department");
            }

        });
    });

    ///Update Department
    $("#updateDepartment").on("click", () => {
        if ($("#departmentInputUpdate").val() === "") {
            resultsBox.fail("Add New Department",
                "Department Name Can Not be Empty");
            return;
        }
        if ($("#departmentLocationIdSelectUpdate").val() === "") {
            resultsBox.fail("Update Department",
                "Select Location");
            return;
        }
        loading.start();
        $('.modal').modal('hide');
        $.ajax({
            url: "php/department/update.php",
            type: "GET",
            dataType: "json",
            data: {
                name: $("#departmentInputUpdate").val(),
                locationID: $("#departmentLocationIdSelectUpdate").val(),
                id: pId
            },
            success: results => {
                $("#departmentInput").val("");

                if (results.status.name === "ok") {
                    loadData();
                    resultsBox.pass("Update Department",
                        "department updated succesfully");
                } else {
                    resultsBox.fail("Update Department",
                        "failed to update department");
                }
                loading.end();
            },
            error: (error, status, errorType) => {
                loading.end();
                resultsBox.fail("Update Department",
                    "failed to add new department");
            }

        });
    });
    /////////////////////////////// 




    $(".addNewBtn").on("click", () => {
        $("#openAdd").modal('hide');
    });
    $("#confirmDeleteBtn").on("click", () => {
        confirmDelete();
    })

    $("#goToPeople").on("click", () => {
        $("#people").show();
        $("#resultsDepartments").hide();
        $("#resultsLocations").hide();
        $(window).scrollTop(0);

    });
    $("#goToLocations").on("click", () => {
        $("#people").hide();
        $("#resultsDepartments").hide();
        $("#resultsLocations").show();
        $(window).scrollTop(0);

    });
    $("#goToDepartments").on("click", () => {
        $("#people").hide();
        $("#resultsDepartments").show();
        $("#resultsLocations").hide();
        $(window).scrollTop(0);

    });


    $("#people").show();
    $("#resultsDepartments").hide();
    $("#resultsLocations").hide();

});