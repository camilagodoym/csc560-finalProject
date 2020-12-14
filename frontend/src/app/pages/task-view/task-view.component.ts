import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists!: List[];
  tasks!: Task[];
  selectedListId!: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }
  
ngOnInit() {
      this.route.params.subscribe(
        (params: Params) => {
          if(params.listId){
        console.log(params);
        this.selectedListId = params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks: any ) => {
        this.tasks =tasks;
          //console.log(tasks); 
        })
      } else {
        this.tasks;
      }

      }
    )

    this.taskService.getLists().subscribe((lists: any) => {
    this.lists=lists;

    })

  }

  onTaskClick(task: Task) {
    // we want to set the task to completed
    this.taskService.completed(task).subscribe(() => {
      // the task has been set to completed successfully
      console.log("Completed succesfully!");
      task.completed = !task.completed;
    })
  }

onDeleteListClick() {
 this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
   this.router.navigate(['/lists']); 
   //I hard coded this listID because when I redirect to list, it is not showing all list
   //after delete we need to refresh the page
   console.log(res);
 });

}

onDeleteTaskClick(id: string) {
  this.taskService.deleteTask(this.selectedListId, id).subscribe((res: any) => {
    //this.router.navigate(['/lists/5fc3f7b5e4e0ce9394085d4d']); 
    //I hard coded this listID because when I redirect to list, it is not showing all list
    //after delete we need to refresh the page
    this.tasks = this.tasks.filter( val => val._id !==id);
    console.log(res);
  });
 
 }

}

 /*
    https://www.youtube.com/watch?v=aOkAx1jZokc&list=PLIjdNHWULhPSZFDzQU6AnbVQNNo1NTRpd&index=5

  }*/