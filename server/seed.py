from random import randint, choice as rc
from datetime import datetime
from faker import Faker

from app import app

from models import db, User, Project, Task, TimeEntry, TaskCategory, TaskStatus

if __name__ == "__main__":

    with app.app_context():
        db.session.query(User).delete()
        db.session.query(Task).delete()
        db.session.query(Project).delete()
        db.session.query(TimeEntry).delete()
        db.session.query(TaskCategory).delete()
        db.session.query(TaskStatus).delete()
        db.session.commit()

        user_1 = User(
            name="Igor",
            password="123",
            email="user@mail.mail",
            ntfy_url="url://",
        )
        user_2 = User(
            name="Tatsiana",
            password="123",
            email="user@mail.mail",
            ntfy_url="url://",
        )
        user_3 = User(
            name="Alex",
            password="123",
            email="user@mail.mail",
            ntfy_url="url://",
        )
        db.session.add_all([user_1, user_2, user_3])
        db.session.commit()

        project_1 = Project(name="Family", description="family time")
        project_2 = Project(name="Personal", description="personal time")
        project_3 = Project(name="Work", description="work time")
        db.session.add_all([project_1, project_2, project_3])
        db.session.commit()

        task_status_1 = TaskStatus(
            name="Future plans", description="task not scheduled"
        )
        task_status_2 = TaskStatus(name="Plan", description="task scheduled")
        task_status_3 = TaskStatus(name="Unscheduled", description="Unscheduled task")
        db.session.add_all([task_status_1, task_status_2, task_status_3])
        db.session.commit()

        task_category_1 = TaskCategory(name="Education", description="education tasks")
        task_category_2 = TaskCategory(name="Home", description="any home tasks")
        task_category_3 = TaskCategory(
            name="Work", description="all revenue-generating tasks"
        )
        task_category_4 = TaskCategory(name="Sport", description="sports activities")
        task_category_5 = TaskCategory(name="Reading", description="book reading")
        task_category_6 = TaskCategory(name="Flatiron School", description="bootcamp")
        task_category_7 = TaskCategory(name="Food", description="meal break")
        db.session.add_all(
            [
                task_category_1,
                task_category_2,
                task_category_3,
                task_category_4,
                task_category_5,
                task_category_6,
                task_category_7,
            ]
        )
        db.session.commit()

        task_1 = Task(
            name="Morning Run",
            description="morning run + workout",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 7, 00, 00),
            end_dt=datetime(2024, 3, 6, 7, 45, 00),
            user_id=1,
            project_id=2,
            category_id=4,
        )
        task_2 = Task(
            name="Drive Alex to school",
            description="-",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 7, 45, 00),
            end_dt=datetime(2024, 3, 6, 8, 00, 00),
            user_id=1,
            project_id=1,
            category_id=2,
        )
        task_3 = Task(
            name="Breakfast",
            description="b",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 8, 00, 00),
            end_dt=datetime(2024, 3, 6, 8, 20, 00),
            user_id=1,
            project_id=2,
            category_id=7,
        )
        task_4 = Task(
            name="Project preparation",
            description="Phase-5. Update Readme. Start to create presentation",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 8, 20, 00),
            end_dt=datetime(2024, 3, 6, 12, 00, 00),
            user_id=1,
            project_id=2,
            category_id=6,
        )
        task_5 = Task(
            name="Lunch",
            description="lunch time",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 12, 00, 00),
            end_dt=datetime(2024, 3, 6, 13, 00, 00),
            user_id=1,
            project_id=2,
            category_id=7,
        )
        task_6 = Task(
            name="Project preparation",
            description="Phase-5. Update Readme. Start to create presentation",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 13, 00, 00),
            end_dt=datetime(2024, 3, 6, 18, 00, 00),
            user_id=1,
            project_id=2,
            category_id=6,
        )
        task_7 = Task(
            name="Volleyball",
            description="take my daughter to volleyball",
            status_id=2,
            start_dt=datetime(2024, 3, 6, 18, 00, 00),
            end_dt=datetime(2024, 3, 6, 21, 20, 00),
            user_id=1,
            project_id=1,
            category_id=4,
        )
        task_8 = Task(
            name="Morning Run",
            description="morning run + workout",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 7, 00, 00),
            end_dt=datetime(2024, 3, 7, 7, 45, 00),
            user_id=1,
            project_id=2,
            category_id=4,
        )
        task_9 = Task(
            name="Drive Alex to school",
            description="-",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 7, 45, 00),
            end_dt=datetime(2024, 3, 7, 8, 00, 00),
            user_id=1,
            project_id=1,
            category_id=2,
        )
        task_10 = Task(
            name="Breakfast",
            description="b",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 8, 00, 00),
            end_dt=datetime(2024, 3, 7, 8, 20, 00),
            user_id=1,
            project_id=2,
            category_id=7,
        )
        task_11 = Task(
            name="Project preparation",
            description="Phase-5. Update Readme. Start to create presentation",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 8, 20, 00),
            end_dt=datetime(2024, 3, 7, 10, 30, 00),
            user_id=1,
            project_id=2,
            category_id=6,
        )
        task_12 = Task(
            name="Project presentation",
            description="Phase-5. Update Readme. Start to create presentation",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 10, 30, 00),
            end_dt=datetime(2024, 3, 7, 12, 00, 00),
            user_id=1,
            project_id=2,
            category_id=6,
        )
        task_13 = Task(
            name="Lunch",
            description="lunch time",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 12, 00, 00),
            end_dt=datetime(2024, 3, 7, 13, 00, 00),
            user_id=1,
            project_id=2,
            category_id=7,
        )
        task_14 = Task(
            name="Project review",
            description="Phase-5.",
            status_id=2,
            start_dt=datetime(2024, 3, 7, 13, 00, 00),
            end_dt=datetime(2024, 3, 7, 18, 00, 00),
            user_id=1,
            project_id=2,
            category_id=6,
        )

        db.session.add_all(
            [
                task_1,
                task_2,
                task_3,
                task_4,
                task_5,
                task_6,
                task_7,
                task_8,
                task_9,
                task_10,
                task_11,
                task_12,
                task_13,
                task_14,
            ]
        )
        db.session.commit()

        time_entry_1 = TimeEntry(
            description="3.8 km",
            start_dt=datetime(2024, 3, 6, 7, 5, 00),
            end_dt=datetime(2024, 3, 6, 7, 50, 00),
            task_id=1,
        )
        time_entry_2 = TimeEntry(
            description="wroom wroom ...",
            start_dt=datetime(2024, 3, 6, 7, 50, 00),
            end_dt=datetime(2024, 3, 6, 8, 5, 00),
            task_id=2,
        )
        time_entry_3 = TimeEntry(
            description="yummy ;)",
            start_dt=datetime(2024, 3, 6, 8, 5, 00),
            end_dt=datetime(2024, 3, 6, 8, 20, 00),
            task_id=3,
        )
        time_entry_4 = TimeEntry(
            description="need to finish readme",
            start_dt=datetime(2024, 3, 6, 8, 22, 00),
            end_dt=datetime(2024, 3, 6, 12, 3, 00),
            task_id=4,
        )
        time_entry_5 = TimeEntry(
            description="steak time!!!",
            start_dt=datetime(2024, 3, 6, 12, 5, 00),
            end_dt=datetime(2024, 3, 6, 13, 10, 00),
            task_id=5,
        )
        time_entry_6 = TimeEntry(
            description="add styles",
            start_dt=datetime(2024, 3, 6, 13, 15, 00),
            end_dt=datetime(2024, 3, 6, 17, 55, 00),
            task_id=6,
        )
        time_entry_7 = TimeEntry(
            description="Let's Go CALI Let's Go.....",
            start_dt=datetime(2024, 3, 6, 18, 2, 00),
            end_dt=datetime(2024, 3, 6, 21, 23, 00),
            task_id=7,
        )
        time_entry_8 = TimeEntry(
            description="4.2 km",
            start_dt=datetime(2024, 3, 7, 7, 15, 00),
            end_dt=datetime(2024, 3, 7, 7, 51, 00),
            task_id=8,
        )
        time_entry_9 = TimeEntry(
            description="wroom wroom ...",
            start_dt=datetime(2024, 3, 7, 7, 53, 00),
            end_dt=datetime(2024, 3, 7, 8, 7, 00),
            task_id=9,
        )
        time_entry_10 = TimeEntry(
            description="Coffee and a sandwich :P",
            start_dt=datetime(2024, 3, 7, 8, 12, 00),
            end_dt=datetime(2024, 3, 7, 8, 19, 00),
            task_id=10,
        )
        time_entry_11 = TimeEntry(
            description="presentation day!!! o_O Hurry up!",
            start_dt=datetime(2024, 3, 7, 8, 22, 00),
            end_dt=datetime(2024, 3, 7, 10, 14, 00),
            task_id=11,
        )
        db.session.add_all(
            [
                time_entry_1,
                time_entry_2,
                time_entry_3,
                time_entry_4,
                time_entry_5,
                time_entry_6,
                time_entry_7,
                time_entry_8,
                time_entry_9,
                time_entry_10,
                time_entry_11,
            ]
        )
        db.session.commit()
