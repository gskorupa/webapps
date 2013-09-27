$(document).ready(function() {

    // variable definitions
    var projects = null;
    var tasks = null;
    var tasksName = "";
    var config = {"app_version": "1", "task_order": "id", "projects_order": "name", "show_completed": "false"};
    var project = null;
    var maxProjectID = -1;
    var maxTaskID = -1;

    // function definitions

    //sorting function to help sort json object
    var sort_by = function(field, reverse, primer) {
        var key = function(x) {
            return primer ? primer(x[field]) : x[field]
        };

        return function(a, b) {
            var A = key(a), B = key(b);
            return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
        }
    };

    var get_task_by_id = function(task_id) {
        var task = "";

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id == task_id) {
                return tasks[i];
            }
        }
        return task;
    };

    var get_project_by_id = function(project_id) {
        var project = "";

        for (var i = 0; i < projects.length; i++) {
            if (projects[i].id == project_id) {
                return projects[i];
            }
        }
        return project;
    };

    var getTasks = function getTasks(tid, element_id) {
        tasksName = "tm-tasks-" + tid;
        if (localStorage[tasksName] == null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage[tasksName]);
        }
    }

    var refreshTaskList = function(element_id) {
        $(element_id).empty();
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (maxTaskID < task.id)
                maxTaskID = task.id;
            if (config.show_completed == "true" || task.done != "true") {
                var task_li = $("<li />", {
                });

                var task_href = $("<a />", {
                    "text": task.name,
                    "data-task-id": task.id
                });

                $(task_li).append(task_href);
                $(element_id).append(task_li);
            }
        }
        $(element_id).listview("refresh");
    }

    var getNextProjectID = function() {
        return maxProjectID + 1;
    }

    var getNextTaskID = function() {
        return maxTaskID + 1;
    }

    var setNextProjectID = function(newID) {
        maxProjectID = newID;
    }

    var setNextTaskID = function(newID) {
        maxTaskID = newID;
    }

    var getProjects = function() {
        if (localStorage["tm-projects"] == null) {
            projects = [];
        } else {
            projects = JSON.parse(localStorage["tm-projects"]);
        }
    }

    var refreshProjectList = function(element_id) {
        $(element_id).empty();
        for (var i = 0; i < projects.length; i++) {
            var proj = projects[i];
            if (maxProjectID < proj.id)
                maxProjectID = proj.id;
            var proj_li = $("<li />", {
            });

            var proj_href = $("<a />", {
                "text": proj.name,
                "data-project-id": proj.id
            });

            $(proj_li).append(proj_href);
            var proj_href2 = $("<a />", {
                "text": "XYZ",
                "data-project-id": proj.id
            });
            $(proj_li).append(proj_href2);
            $("#main-project-list").append(proj_li);
        }

        //when you add dynamic data to a jquerymobile listview - 
        //you have to refresh it
        $("#main-project-list").listview('refresh');

        //hide the ajax loader image and show the listview
        $("div.loader").hide(0, function() {
            $("#main-project-list").fadeIn();
        });
    }

    var saveTask = function() {
        //var contact = get_contact_by_id(selected_contact_id);
        var task = {"id": -1, "name": "", "duedate": "", "done": "", "description": "", "priority": 0, "tags": ""};

        //assume you validated the input, update the contact object
        task.id = parseInt($("div.new_task_id").html());
        task.name = $("#add-tname").val();
        task.description = $("#add-tdescription").val();
        task.duedate = $("#add-tddate").val();
        task.priority = parseInt($("#add-tpriority").val());
        task.done = "false";
        task.tags = $("#add-ttags").val();
        tasks[tasks.length] = task;
        localStorage[tasksName] = JSON.stringify(tasks);
        refreshTaskList("#main-task-list");
    }

    var changeTask = function() {
        //var contact = get_contact_by_id(selected_contact_id);
        var task = {"id": -1, "name": "", "duedate": "", "done": "", "description": "", "priority": 0, "tags": ""};

        //assume you validated the input, update the contact object
        task.id = parseInt($("div.new_task_id").html());
        task.name = $("#edit-tname").val();
        task.description = $("#edit-tdescription").val();
        task.duedate = $("#edit-tddate").val();
        task.priority = parseInt($("#edit-tpriority").val());
        task.done = "false";
        task.tags = $("#edit-ttags").val();
        var i = -1;
        var found = false;
        var tmpTask;
        while (!found) {
            i++;
            tmpTask = tasks[i];
            found = tmpTask.id == task.id;
        }
        if (found) {
            tasks[i] = task;
            localStorage[tasksName] = JSON.stringify(tasks);
        } else {
            //error
        }
        fillTaskView(task);
    }

    var deleteProject = function(projectToDelete) {
        var i = -1;
        var found = false;
        var tmpProject;
        while (!found) {
            i++;
            tmpProject = projects[i];
            found = tmpProject.id == projectToDelete.id;
        }
        if (found) {
            projects.splice(i, 1);
            localStorage["tm-projects"] = JSON.stringify(projects);
        } else {
            //error
        }
    }

var deleteTask = function(taskToDelete) {
        //var id = parseInt($("div.new_task_id").html());
        var i = -1;
        var found = false;
        var tmpTask;
        while (!found) {
            i++;
            tmpTask = tasks[i];
            found = tmpTask.id == taskToDelete.id;
        }
        if (found) {
            tasks.splice(i, 1);
            localStorage[tasksName] = JSON.stringify(tasks);
        } else {
            //error
        }
        if (tasks.length == 0) {
            localStorage.removeItem(tasksName);
        }

    }

    var saveProject = function() {
        var project = {"id": -1, "name": "", "description": "", "tags": ""};
        project.id = parseInt($("div.new_project_id").html());
        project.name = $("#add-pname").val();
        project.tags = $("#add-ptags").val();
        project.description = $("#add-pdescription").val();
        projects[projects.length] = project;
        localStorage["tm-projects"] = JSON.stringify(projects);
    }
    
    var changeProject = function() {
        var project = {"id": -1, "name": "", "description": "", "tags": ""};
        project.id = parseInt($("div.project_id").html());
        project.name = $("#edit-pname").val();
        project.tags = $("#edit-ptags").val();
        project.description = $("#edit-pdescription").val();
        var i = -1;
        var found = false;
        var tmpProject;
        while (!found) {
            i++;
            tmpProject = projects[i];
            found = tmpProject.id == project.id;
        }
        if (found) {
            projects[i] = project;
            localStorage["tm-projects"] = JSON.stringify(projects);
        } else {
            //error
        }
        fillProjectView(project);
    }

    var fillProjectView = function(newProject) {
        if (newProject != "") {
            $("div.name").html(newProject.name);
            $("div.id").html(newProject.id);
            $("div.description").html(newProject.description);
            $("div.tags").html(newProject.tags);
        } else {
            $("div.name").html("");
            $("div.id").html("");
            $("div.description").html("");
            $("div.tags").html("");
        }
    }

    var fillTaskView = function(newTask) {
        if (newTask != "") {
            $("div.name").html(newTask.name);
            $("div.id").html(newTask.id);
            $("div.done").html(newTask.done);
            $("div.description").html(newTask.description);
            $("div.duedate").html(newTask.duedate);
            $("div.priority").html(newTask.priority);
            $("div.tags").html(newTask.tags);
        } else {
            $("div.name").html("");
            $("div.id").html("");
            $("div.done").html("");
            $("div.description").html("");
            $("div.duedate").html("");
            $("div.priority").html("0");
            $("div.tags").html("");
        }
    }

    var fillProjectForm = function(newProject) {
        if (newProject !== null) {
            $("#add-pname").val(newProject.name);
            $("div.new_project_id").html(newProject.id);
            $("#add-pdescription").val(newProject.description);
        } else {
            $("#add-pname").val("");
            $("div.id").val("");
            $("#add-tdescription").val("");
        }
    }

    var fillEditProjectForm = function(newProject) {
        if (newProject !== null) {
            $("#edit-pname").val(newProject.name);
            $("div.project_id").html(newProject.id);
            $("#edit-pdescription").val(newProject.description);
        } else {
            $("#edit-pname").val("");
            $("div.id").val("");
            $("#edit-pdescription").val("");
        }
    }

    var fillTaskForm = function(newTask) {
        if (newTask !== null) {
            $("#add-tname").val(newTask.name);
            $("div.id").html(newTask.id);
            $("#add-tdone").val(newTask.done);
            $("#add-tdescription").val(newTask.description);
            $("#add-tddate").val(newTask.duedate);
            $("#add-tpriority select").val(newTask.priority);
            $("#add-ttags").val(newTask.tags);
        } else {
            $("#add-tname").val("");
            $("div.id").val("");
            $("#add-tdone").val("");
            $("#add-tdescription").val("");
            $("#add-tddate").val("");
            $("#add-tpriority select").val("0");
            $("#add-ttags").val("");
        }
    }

    var fillEditTaskForm = function(newTask) {
        if (newTask !== null) {
            $("#edit-tname").val(newTask.name);
            $("div.id").html(newTask.id);
            $("#edit-tdone").val(newTask.done);
            $("#edit-tdescription").val(newTask.description);
            $("#edit-tddate").val(newTask.duedate);
            $("#edit-tpriority select").val(newTask.priority);
            $("#edit-ttags").val(newTask.tags);
        } else {
            $("#edit-tname").val("");
            $("div.id").val("");
            $("#edit-tdone").val("");
            $("#edit-tdescription").val("");
            $("#edit-tddate").val("");
            $("#edit-tpriority select").val("0");
            $("#edit-ttags").val("");
        }
    }

    var getDateStr = function() {
        var myDate = new Date();
        return myDate.getDate() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getFullYear();
    }

    var getConfig = function() {
        if (localStorage["tm-config"] != null) {
            config = JSON.parse(localStorage["tm-config"]);
        }
    }

    var saveConfig = function() {
        localStorage["tm-config"] = JSON.stringify(config);
    }

    // -------------------------------------------------------------------------
    // run init functions
    // -------------------------------------------------------------------------

    //after the page loads load list of projects
    getConfig();
    getProjects();
    refreshProjectList();

    // -------------------------------------------------------------------------
    // handler definitions
    // -------------------------------------------------------------------------

    //function to handle the click of a task
    $("body").delegate("#main-task-list li a", "tap", function(event, ui) {
        event.preventDefault();

        //get the appropriate contact from the json object and paint the details pane
        var task = get_task_by_id($(this).attr("data-task-id"));
        if (task !== "") {
            fillTaskView(task);
            //after the details pane is painted, navigate user to details view
            $.mobile.changePage("#task-details", {transition: "slidefade"});
        } else {
            alert("Error while loading task data");
        }
    });

    //handle the click of a project
    //after click the task list page is displayed for selected project
    $("body").delegate("#main-project-list li a", "tap", function(event, ui) {
        event.preventDefault();

        //get the appropriate contact from the json object and paint the details pane
        var project_id = $(this).attr("data-project-id");
        project = get_project_by_id(project_id);
        $.mobile.changePage("#task-list", {transition: "slidefade"});
        $("div.project_name").html(project.name + " tasks");
        getTasks(project_id, "#main-task-list");
        refreshTaskList("#main-task-list");
        //hide the ajax loader image and show the listview
        $("div.loader").hide(0, function() {
            $("#main-task-list").fadeIn();
        });
    });

    $("body").delegate("a.addnewproject", "tap", function(event, ui) {
        event.preventDefault();
        $.mobile.changePage("#new-project", {transition: "fade"});
        $("div.new_project_id").html(getNextProjectID());
    });

    $("body").delegate("a.editproject", "tap", function(event, ui) {
        event.preventDefault();
        var project = get_project_by_id($("div.id").html());
        $.mobile.changePage("#edit-project", {transition: "fade"});
        fillEditProjectForm(project);
    });
    
    $("body").delegate("a.deleteproject", "tap", function(event, ui) {
        event.preventDefault();
        if(tasks.length>0){
            alert("There are defined project tasks. Can't delete.");
            return;
        }
        var project = get_project_by_id($("div.id").html());
        if (confirm("Would you like to delete this project?")) {
            deleteProject(project);
            $.mobile.changePage("#project-list", {transition: "fade"});
            refreshProjectList("#main-project-list");
        }
    });

    $("body").delegate("a.addnewtask", "tap", function(event, ui) {
        event.preventDefault();
        $.mobile.changePage("#new-task", {transition: "fade"});
        fillTaskForm(null);
        $("div.new_task_id").html(getNextTaskID());
    });

    $("body").delegate("a.edittask", "tap", function(event, ui) {
        event.preventDefault();
        var task = get_task_by_id($("div.id").html());
        $.mobile.changePage("#edit-task", {transition: "fade"});
        fillEditTaskForm(task);
        $("div.new_task_id").html(task.id);
    });

    $("body").delegate("a.deletetask", "tap", function(event, ui) {
        event.preventDefault();
        var task = get_task_by_id($("div.id").html());
        if (confirm("Would you like to delete this task?")) {
            deleteTask(task);
            //refresh task list
            //$.mobile.changePage("#task-list", {transition: "fade"});
            refreshTaskList("#main-task-list");
            history.go(-1);
        }
    });

    $("body").delegate("a.configure", "tap", function(event, ui) {
        event.preventDefault();
        $.mobile.changePage("#config", {transition: "fade"});
    });

    $("body").delegate("[href='#project-details']", "tap", function(event, ui) {
        event.preventDefault();
        $.mobile.changePage("#project-details", {transition: "fade"});
        $("div.id").html(project.id);
        $("div.name").html(project.name);
        $("div.description").html(project.description);
    });

    //save new task
    $("body").delegate("button.new-task-save", "tap", function(event) {
        event.preventDefault();
        saveTask();
        refreshTaskList("#main-task-list");
        history.go(-1);

    });

    //save task
    $("body").delegate("button.task-save", "tap", function(event) {
        event.preventDefault();
        changeTask();
        refreshTaskList("#main-task-list");
        history.go(-1);

    });

    $("body").delegate("button.new-project-save", "tap", function(event) {
        event.preventDefault();
        saveProject();
        history.go(-1);
        refreshProjectList("#main-project-list");
    });

    $("body").delegate("button.project-save", "tap", function(event) {
        event.preventDefault();
        changeProject();
        history.go(-1);
        refreshProjectList("#main-project-list");
    });

});
