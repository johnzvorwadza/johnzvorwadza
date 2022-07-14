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


        /*$("#results").append(`
<div class="row">
    <div class="resultsName"><h3><i class="fa-solid fa-person"></i> <span>${person[2]}, ${person[1]}</span></h3></div>
    <div class="rowDetails"><i class="fa-solid fa-envelope"></i> <span>${person[4]}</span></div>
    <div class="rowDetails"><i class="fa-solid fa-book"></i> <span></span>${dept[1]}</div>
    <div class="rowDetails"><i class="fa-solid fa-location-crosshairs"></i> <span>${loc[1]}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${person[0]}" class="fa-solid fa-pen-to-square editPersonnelIcon"></i>
        <i id="${person[0]}" class="fa-solid fa-trash-can deleteIcon"></i>
        </div>
</div>`);*/

$("#results").append(`
        <div class="col-12 col-md-6 col-lg-4">
        <div class="card">
        <div class="card-body">
            <h5 class="card-title"><i class="fa-solid fa-person"></i> <span>${person[2]}, ${person[1]}</span></h5>
            <p class="card-text">
            <div class="rowDetails"><i class="fa-solid fa-envelope"></i> <span>${person[4]}</span></div>
    <div class="rowDetails"><i class="fa-solid fa-book"></i> <span></span>${dept[1]}</div>
    <div class="rowDetails"><i class="fa-solid fa-location-crosshairs"></i> <span>${loc[1]}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${person[0]}" class="fa-solid fa-pen-to-square editPersonnelIcon"></i>
        <i id="${person[0]}" class="fa-solid fa-trash-can deleteIcon"></i>
        </div>

            </p>
        </div>
    </div>
            </div>
        </div>
`);



    });
    loading.end();
    $(".deleteIcon").on("click", e => {
        //.attr("employee")
        pId = e.target.id;
        deleteType = 0;
        loading.start();
    $.ajax({
        url: "php/person/getPersonnelById.php",
        type: "GET",
        data: {
            id: pId
        },
        dataType: "json",
        success: (results) => {
            if (results.status.name === "ok") {
                $(".deleteType").html(`employee : <b>${results.data[0][2]}, ${results.data[0][1]}</b>`);
                $("#confirmDelete").modal("show");
                
                loading.end();
            } else {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }


        },
        error: (err, status, type) => {
            resultsBox.fail("Error", "Sorry, failed to processs your request");
            loading.end();
        }
    });

    });

    $(".editPersonnelIcon").on("click", e => {
        pId = e.target.id;
        setDataEditPersonnel();
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
        <div class="col-12 col-md-6 col-lg-4">
        <div class="card">
        <div class="card-body">
            <h5 class="card-title"><i class="fa-solid fa-book"></i> <span>${department[1]}</span></h5>
            <p class="card-text">

            <div class="rowDetails"><i class="fa-solid fa-people-group"></i> <span>${numPeople}</span></div>
    <div class="rowDetails"><i class="fa-solid fa-location-crosshairs"></i> <span>${loc[1]}</span></div>
    <div class="delete-edit-cont">
        <i id="${department[0]}" class="fa-solid fa-pen-to-square editDepartmentIcon"></i>
        <i id="${department[0]}" class="fa-solid fa-trash-can deleteDepartmentIcon"></i>
        </div>
            
            </p>
        </div>
    </div>
            </div>
        </div>
`);



    });
    $(".deleteDepartmentIcon").on("click", e => {
        pId = e.target.id;
        deleteType = 2;
        loading.start();
        $.ajax({
            url: "php/department/getDepartmentById.php",
            type: "GET",
            data: {
                id: pId
            },
            dataType: "json",
            success: (results) => {
                if (results.status.name === "ok" && results.count < 1) {
                    $(".deleteType").html(`department : <b>${results.data[0][1]}</b>`);
                    $("#confirmDelete").modal("show");
                    loading.end();
                }else if(results.status.name === "ok" && results.count > 0){
                    resultsBox.fail("Delete Department", `Sorry, failed to delete: ${results.count} personnels are using this department`);
                    loading.end();

                }
                
                else {
                    resultsBox.fail("Error", "Sorry, failed to delete department");
                    loading.end();
                }
    
    
            },
            error: (err, status, type) => {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }
        });
    });

    $(".editDepartmentIcon").on("click", e => {
        pId = e.target.id;
        setDataEditDepartment();


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
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title"><i class="fa-solid fa-location-crosshairs"></i> <span>${location[1]}</span></h5>
                    <p class="card-text">
                    <div class="rowDetails"><i class="fa-solid fa-book"></i> <span>${numDepartments}</span></div>
    <div class="rowDetails delete-edit-cont">
        <i id="${location[0]}" class="fa-solid fa-pen-to-square editLocationIcon"></i>
        <i id="${location[0]}" class="fa-solid fa-trash-can deleteLocationIcon"></i>
        </div>
                    
                    </p>
                </div>
            </div>
        </div>

`);



    });

    $(".deleteLocationIcon").on("click", e => {
        pId = e.target.id;
        deleteType = 1;loading.start();
        $.ajax({
            url: "php/location/getLocationById.php",
            type: "GET",
            data: {
                id: pId
            },
            dataType: "json",
            success: (results) => {
                if (results.status.name === "ok" && results.count < 1) {
                    $(".deleteType").html(`location : <b>${results.data[0][1]}</b>`);
                    $("#confirmDelete").modal("show");
                    loading.end();
                }else if(results.status.name === "ok" && results.count > 0){
                    resultsBox.fail("Delete Location", `Sorry, failed to delete: ${results.count} departments are using this department`);
                    loading.end();

                }
                
                else {
                    resultsBox.fail("Error", "Sorry, failed to delete department");
                    loading.end();
                }
    
    
            },
            error: (err, status, type) => {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }
        });

    });

    $(".editLocationIcon").on("click", e => {
        pId = e.target.id;
        setDataEditLocation();
    });


}


function setDataEditPersonnel() {
    loading.start();
    $.ajax({
        url: "php/person/getPersonnelById.php",
        type: "GET",
        data: {
            id: pId
        },
        dataType: "json",
        success: (results) => {
            if (results.status.name === "ok") {
                $("#firstNameInputUpdate").val(results.data[0][1]);
                $("#lastNameInputUpdate").val(results.data[0][2]);
                $("#jobTitleInputUpdate").val(results.data[0][3]);
                $("#emailInputUpdate").val(results.data[0][4]);
                $("#updateNameSelectDepartment").html("");
                results.departments.forEach(d => {
                    if (d[0] === results.data[0][5]) {
                        $("#updateNameSelectDepartment").append(
                            `<option selected="true" value="${d[0]}">${d[1]}</option>`);
                    } else {
                        $("#updateNameSelectDepartment").append(
                            `<option  value="${d[0]}">${d[1]}</option>`);
                    }

                });

                $("#updateEmployeeModal").modal("show");
                loading.end();
            } else {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }


        },
        error: (err, status, type) => {
            resultsBox.fail("Error", "Sorry, failed to processs your request");
            loading.end();
        }
    });
}

function setDataEditDepartment() {
    loading.start();
    $.ajax({
        url: "php/department/getDepartmentById.php",
        type: "GET",
        data: {
            id: pId
        },
        dataType: "json",
        success: (results) => {
            if (results.status.name === "ok") {
                $("#departmentInputUpdate").val(results.data[0][1]);
                $("#departmentLocationIdSelectUpdate").html("");
                results.locations.forEach(l => {
                    if (l[0] === results.data[0][2]) {
                        $(".locationsSelect").append(
                            `<option selected="true" value="${l[0]}">${l[1]}</option>`);
                    } else {
                        $(".locationsSelect").append(`<option  value="${l[0]}">${l[1]}</option>`);
                    }

                });

                $("#updateDepartmentModal").modal("show");
                loading.end();
            } else {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }


        },
        error: (err, status, type) => {
            resultsBox.fail("Error", "Sorry, failed to processs your request");
            loading.end();
        }
    });
}

function setDataEditLocation() {
    loading.start();
    $.ajax({
        url: "php/location/getLocationById.php",
        type: "GET",
        data: {
            id: pId
        },
        dataType: "json",
        success: (results) => {
            if (results.status.name === "ok") {
                $("#locationInputUpdate").val(results.data[0][1]);
                $("#updateLocationModal").modal("show");
                loading.end();
            } else {
                resultsBox.fail("Error", "Sorry, failed to processs your request");
                loading.end();
            }


        },
        error: (err, status, type) => {
            resultsBox.fail("Error", "Sorry, failed to processs your request");
            loading.end();
        }
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

function loadData() {
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



    //////
    $("#addNameForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!$("#emailInputUpdate").val().match(mailformat)) {
            resultsBox.fail("Update Employee",
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
    $("#updateNameForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
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
    $("#addLocationForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
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
    $("#updateLocationForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
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
    $("#addDepartmentForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
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
    $("#updateDepartmentForm").on("submit", e => {
        e.preventDefault();
        e.stopPropagation();
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




    let currentPage = 0;
    $("#openAdd").on("click", () => {
        if (currentPage === 0) {
            $("#addEmployeeModal").modal('show');
        } else if (currentPage === 1) {
            $("#addDepartmentModal").modal('show');
        } else if (currentPage === 2) {
            $("#addLocationModal").modal('show');
        }

    });


    $("#confirmDeleteBtn").on("click", () => {
        confirmDelete();
    })

    $("#goToPeople").on("click", () => {
        $("#goToDepartments").css("background", "gray");
        $("#goToLocations").css("background", "gray");
        $("#goToPeople").css("background", "black");
        currentPage = 0;
        $("#people").show();
        $("#resultsDepartments").hide();
        $("#resultsLocations").hide();
        $(window).scrollTop(0);

    });
    $("#goToLocations").on("click", () => {
        $("#goToPeople").css("background", "gray");
        $("#goToDepartments").css("background", "gray");
        $("#goToLocations").css("background", "black");
        currentPage = 2;
        $("#people").hide();
        $("#resultsDepartments").hide();
        $("#resultsLocations").show();
        $(window).scrollTop(0);

    });
    $("#goToDepartments").on("click", () => {
        $("#goToPeople").css("background", "gray");
        $("#goToLocations").css("background", "gray");
        $("#goToDepartments").css("background", "black");
        currentPage = 1;
        $("#people").hide();
        $("#resultsDepartments").show();
        $("#resultsLocations").hide();
        $(window).scrollTop(0);

    });


    $("#goToDepartments").css("background", "gray");
    $("#goToLocations").css("background", "gray");
    $("#goToPeople").css("background", "black");

    $("#people").show();
    $("#resultsDepartments").hide();
    $("#resultsLocations").hide();

});