from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)
    ntfy_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Add relationship
    tasks = db.relationship("Task", back_populates="user")
    # Add serialization rules
    serialize_rules = ("-tasks.user",)
    # Add validation

    def __repr__(self):
        return f"<User {self.name}: {self.tasks}>"


class Project(db.Model, SerializerMixin):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Add relationship
    tasks = db.relationship("Task", back_populates="project")
    # Add serialization rules
    serialize_rules = ("-tasks.project",)
    # Add validation


class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    status_id = db.Column(db.Integer, db.ForeignKey("task_statuses.id"))
    start_dt = db.Column(db.DateTime)
    end_dt = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"))
    category_id = db.Column(db.Integer, db.ForeignKey("task_categories.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Add relationship
    user = db.relationship("User", back_populates="tasks")
    project = db.relationship("Project", back_populates="tasks")
    status = db.relationship("TaskStatus", back_populates="task")
    time_entries = db.relationship("TimeEntry", back_populates="task")
    category = db.relationship("TaskCategory", back_populates="tasks")
    # Add serialization rules
    serialize_rules = (
        "-user.tasks",
        "-project.tasks",
        "-status.task",
        "-time_entries.task",
        "-category.tasks",
    )
    # Add validation


class TimeEntry(db.Model, SerializerMixin):
    __tablename__ = "time_entries"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    start_dt = db.Column(db.DateTime)
    end_dt = db.Column(db.DateTime)
    task_id = db.Column(db.Integer, db.ForeignKey("tasks.id"))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Add relationship
    task = db.relationship("Task", back_populates="time_entries")
    # Add serialization rules
    serialize_rules = ("-task.time_entries",)


class TaskCategory(db.Model, SerializerMixin):
    __tablename__ = "task_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    # Add relationship
    tasks = db.relationship("Task", back_populates="category")
    # Add serialization rules
    serialize_rules = ("-task.category",)


class TaskStatus(db.Model, SerializerMixin):
    __tablename__ = "task_statuses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)

    # Add relationship
    task = db.relationship("Task", back_populates="status")
    # Add serialization rules
    serialize_rules = ("-task.status",)
