import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  { path: 'role-mange', component: RoleManageComponent },
  { path: 'members', component: MembersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManageRoutingModule { }
