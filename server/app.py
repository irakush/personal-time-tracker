from flask import request, make_response, session, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, api, db

from models import User, Project, Task, TimeEntry, TaskCategory, TaskStatus
from datetime import datetime, timedelta


# create dynamic routes decorator
@app.route("/")  # route decorator
def index():
    return "<h1> Hello from the app!  </h1>"


################################################
### USER #######################################
################################################


@app.route("/users", methods=["GET", "POST"])
def users():
    if request.method == "GET":
        users = User.query.all()
        response = make_response([user.to_dict() for user in users], 200)
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            print(" FORM DATA :: ", form_data)

            new_user = User(
                name=form_data["name"],
                password=form_data["password"],
                email=form_data["email"],
                ntfy_url=form_data["ntfy_url"],
            )

            db.session.add(new_user)
            db.session.commit()

            response = make_response(new_user.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/users/<int:id>", methods=["GET", "PATCH", "DELETE"])
def users_by_id(id):
    user = User.query.filter(User.id == id).first()
    if user:
        if request.method == "GET":
            response = make_response(user.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                for attr in form_data:
                    setattr(user, attr, form_data[attr])

                db.session.commit()

                response = make_response(user.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            assoc_tasks = Task.query.filter(Task.user_id == id).all()
            for assoc_task in assoc_tasks:
                db.session.delete(assoc_task)

            db.session.delete(user)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "User not found"}, 404)

    return response


@app.route("/users/<string:name>", methods=["GET"])
def users_by_name(name):
    print(name)
    user = User.query.filter_by(name=name).first()
    if user:
        if request.method == "GET":
            response = make_response(user.to_dict(), 200)
    else:
        response = make_response({"error": "User not found"}, 404)

    return response


####################################################
### PROJECTS #######################################
####################################################


@app.route("/projects", methods=["GET", "POST"])
def projects():
    if request.method == "GET":
        projects = Project.query.all()
        response = make_response([project.to_dict() for project in projects], 200)
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            new_project = Project(
                name=form_data["name"], description=form_data["description"]
            )

            db.session.add(new_project)
            db.session.commit()

            response = make_response(new_project.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/projects/<int:id>", methods=["GET", "PATCH", "DELETE"])
def projects_by_id(id):
    project = Project.query.filter(Project.id == id).first()
    if project:
        if request.method == "GET":
            response = make_response(project.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                for attr in form_data:
                    setattr(project, attr, form_data[attr])

                db.session.commit()

                response = make_response(project.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            assoc_tasks = Task.query.filter(Task.project_id == id).all()
            for assoc_task in assoc_tasks:
                db.session.delete(assoc_task)

            db.session.delete(project)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "Project not found"}, 404)

    return response


####################################################
### TASKS ##########################################
####################################################

# task_1 = Task(
#     name="Morning Exercises",
#     description="morning workout",
#     status_id=2,
#     start_dt=datetime(2022, 2, 28, 7, 00, 00),
#     end_dt=datetime(2022, 2, 28, 7, 30, 00),
#     user_id=1,
#     project_id=1,
#     category_id=1,
# )


@app.route("/tasks", methods=["GET", "POST"])
def tasks():
    if request.method == "GET":
        tasks = Task.query.all()
        response = make_response([task.to_dict() for task in tasks], 200)
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            new_task = Task(
                name=form_data["name"],
                description=form_data["description"],
                status_id=form_data["status_id"],
                user_id=form_data["user_id"],
                project_id=form_data["project_id"],
                category_id=form_data["category_id"],
                start_dt=datetime.fromisoformat(form_data["start_dt"]),
                end_dt=datetime.fromisoformat(form_data["end_dt"]),
            )

            db.session.add(new_task)
            db.session.commit()

            response = make_response(new_task.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/tasks/<int:id>", methods=["GET", "PATCH", "DELETE"])
def tasks_by_id(id):
    task = Task.query.filter(Task.id == id).first()
    if task:
        if request.method == "GET":
            response = make_response(task.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                form_data["start_dt"] = datetime.fromisoformat(form_data["start_dt"])
                form_data["end_dt"] = datetime.fromisoformat(form_data["end_dt"])
                print(" form_data ::: ", form_data)
                for attr in form_data:
                    setattr(task, attr, form_data[attr])

                db.session.commit()

                response = make_response(task.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            db.session.delete(task)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "Task not found"}, 404)

    return response


@app.route("/tasks/user/<int:id>", methods=["GET"])
def tasks_by_user_id(id):
    tasks = Task.query.filter(Task.user_id == id).all()
    response = make_response([task.to_dict() for task in tasks], 200)

    return response


@app.route("/tasks_by_date/<string:date>", methods=["GET"])
def get_tasks_by_date(date):
    try:
        # Преобразуем строку даты в объект datetime
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()

        # Вычисляем начало и конец дня для указанной даты
        start_of_day = datetime.combine(date_obj, datetime.min.time())
        end_of_day = datetime.combine(date_obj + timedelta(days=1), datetime.min.time())

        # Выполняем запрос к базе данных для получения задач в диапазоне времени
        tasks = Task.query.filter(
            Task.start_dt >= start_of_day, Task.start_dt < end_of_day
        ).all()

        # Преобразуем результаты запроса в список словарей для сериализации
        task_dicts = [task.to_dict() for task in tasks]

        return jsonify(task_dicts), 200
    except ValueError:
        return (
            jsonify(
                {
                    "error": "Invalid date format. Please provide the date in the format YYYY-MM-DD."
                }
            ),
            400,
        )


####################################################
### TimeEntry ##########################################
####################################################


@app.route("/task_entries", methods=["GET", "POST"])
def task_entries():
    if request.method == "GET":
        task_entries = TimeEntry.query.all()
        response = make_response(
            [task_entry.to_dict() for task_entry in task_entries], 200
        )
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            print(" :::::::::::::::::::: ", form_data)

            new_entry = TimeEntry(
                description=form_data["description"],
                start_dt=datetime.fromisoformat(form_data["start_dt"]),
                # end_dt=datetime.fromisoformat(form_data["end_dt"]),
                task_id=form_data["task_id"],
            )

            db.session.add(new_entry)
            db.session.commit()

            response = make_response(new_entry.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/task_entries/<int:id>", methods=["GET", "PATCH", "DELETE"])
def task_entries_by_id(id):
    task_entry = TimeEntry.query.filter(TimeEntry.id == id).first()
    if task_entry:
        if request.method == "GET":
            response = make_response(task_entry.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                print(" ::::::::::::::::::::::: ", form_data)
                if "start_dt" in form_data:
                    form_data["start_dt"] = datetime.fromisoformat(
                        form_data["start_dt"]
                    )
                if "end_dt" in form_data:
                    form_data["end_dt"] = datetime.fromisoformat(form_data["end_dt"])

                for attr in form_data:
                    setattr(task_entry, attr, form_data[attr])

                db.session.commit()

                response = make_response(task_entry.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            db.session.delete(task_entry)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "Task Entry not found"}, 404)

    return response


@app.route("/task_entries_by_date/<string:date>", methods=["GET"])
def get_task_entries_by_date(date):
    try:
        # Преобразуем строку даты в объект datetime
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()

        # Вычисляем начало и конец дня для указанной даты
        start_of_day = datetime.combine(date_obj, datetime.min.time())
        end_of_day = datetime.combine(date_obj + timedelta(days=1), datetime.min.time())

        # Выполняем запрос к базе данных для получения задач в диапазоне времени
        entries = TimeEntry.query.filter(
            TimeEntry.start_dt >= start_of_day, TimeEntry.start_dt < end_of_day
        ).all()

        # Преобразуем результаты запроса в список словарей для сериализации
        entry_dicts = [entry.to_dict() for entry in entries]

        return jsonify(entry_dicts), 200
    except ValueError:
        return (
            jsonify(
                {
                    "error": "Invalid date format. Please provide the date in the format YYYY-MM-DD."
                }
            ),
            400,
        )


####################################################
### TASK STATUS ####################################
####################################################


@app.route("/task_statuses", methods=["GET", "POST"])
def task_statuses():
    if request.method == "GET":
        task_statuses = TaskStatus.query.all()
        response = make_response(
            [task_status.to_dict() for task_status in task_statuses], 200
        )
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            new_task_status = TaskStatus(
                name=form_data["name"], description=form_data["description"]
            )

            db.session.add(new_task_status)
            db.session.commit()

            response = make_response(new_task_status.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/task_statuses/<int:id>", methods=["GET", "PATCH", "DELETE"])
def task_status_by_id(id):
    task_status = TaskStatus.query.filter(TaskStatus.id == id).first()
    if task_status:
        if request.method == "GET":
            response = make_response(task_status.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                for attr in form_data:
                    setattr(task_status, attr, form_data[attr])

                db.session.commit()

                response = make_response(task_status.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            db.session.delete(task_status)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "Project not found"}, 404)

    return response


####################################################
### Task Category ##################################
####################################################


@app.route("/task_categories", methods=["GET", "POST"])
def task_categories():
    if request.method == "GET":
        task_categories = TaskCategory.query.all()
        response = make_response(
            [task_category.to_dict() for task_category in task_categories], 200
        )
    elif request.method == "POST":
        try:
            form_data = request.get_json()

            new_task_category = TaskCategory(
                name=form_data["name"], description=form_data["description"]
            )

            db.session.add(new_task_category)
            db.session.commit()

            response = make_response(new_task_category.to_dict(), 201)
        except ValueError:
            response = make_response({"errors": ["validation errors"]}, 400)

    return response


@app.route("/task_categories/<int:id>", methods=["GET", "PATCH", "DELETE"])
def task_categories_by_id(id):
    task_category = TaskCategory.query.filter(TaskCategory.id == id).first()
    if task_category:
        if request.method == "GET":
            response = make_response(task_category.to_dict(), 200)
        elif request.method == "PATCH":
            try:
                form_data = request.get_json()
                for attr in form_data:
                    setattr(task_category, attr, form_data[attr])

                db.session.commit()

                response = make_response(task_category.to_dict(), 202)
            except ValueError:
                response = make_response({"errors": ["validation errors"]}, 400)
        elif request.method == "DELETE":
            db.session.delete(task_category)
            db.session.commit()

            response = make_response({}, 204)
    else:
        response = make_response({"error": "Project not found"}, 404)

    return response


if __name__ == "__main__":  # if the __name__(current module) is main
    app.run(port=5555, debug=True)  # then run the port at 5555
