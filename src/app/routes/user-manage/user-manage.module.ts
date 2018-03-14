import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserManageRoutingModule } from './user-manage-routing.module';
import { RoleManageComponent } from './role-manage/role-manage.component';
import { MembersComponent } from './members/members.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    UserManageRoutingModule
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    RoleManageComponent,
    MembersComponent
  ],
  entryComponents: COMPONENT_NOROUNT
})
export class UserManageModule { }
