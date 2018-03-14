import { Component } from '@angular/core';
import { environment } from "@env/environment";//引入系统配置
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-role-manage',
    templateUrl: './role-manage.component.html',
    styleUrls: ['./role-manage.component.less']
})
export class RoleManageComponent {
    private rolesUrl = `${environment.SERVER_URL}/user-manage/role-manage`;//用来获取角色的接口
    rolesData: any = [];//表格实际显示的数据
    rootData: any = [];//表格权限模块表格实际显示的数据
    isChkDisabled: boolean;//定义复选框是否可点
    isFooter: boolean;//定义是否显示modialog底部按钮变量
    addOrUpldRoleTitle: string;//定义modialog头部title变量
    ajaxType: string;//定义ajax标识ajaxType=post(添加)；ajaxType=put(修改)
    isRolenameDisabled: boolean;//定义角色管理表单是否可填
    role: object = {};//表单取值对象
    isShow: boolean;//定义是否显示角色表单
    loading = false;//控制modal框内提交按钮的loading状态
    modalVisible = false;//控制modal的显示与否
    copyData: any = [];//存放表格中后台最新的数据，用来给搜索使用
    style: any = {
        top: '10px'
    };//初始化modal框距离顶部的距离
    rootOptions = [
        {
            label: "全选只读",
            value: "r"
        },
        {
            label: "全选读写",
            value: "rw",
        },
        {
            label: "取消全选",
            value: "none"
        }
    ];//初始化是否全选下拉框

    /* 是否全选监听事件 */
    isSelectChg(isClose) {
        if (!isClose) {
            let chkarr = window['$'](`#privilegeTbl input:checkbox[value=${this.role['isSelect']}]`);
            let unchkarr = window['$'](`#privilegeTbl input:checkbox[value!=${this.role['isSelect']}]`);
            for (let i = 0; i < chkarr.length; i++) {
                chkarr[i]['checked'] = true;
            }
            for (let i = 0; i < unchkarr.length; i++) {
                unchkarr[i]['checked'] = false;
            }
        }
    }

    /* 复选框触发事件 使同一权限模块不能同时选择只读和读写复选框*/
    chgRdo(unChkVal, priId) {
        window['$']("#privilegeTbl input:checkbox[value=" + unChkVal + "][priId=" + priId + "]").prop('checked', false);
    }

    constructor(private http: _HttpClient, private message: NzMessageService) { }

    ngOnInit() {
        this.getRoles();//调用获取角色和权限模块数据的方法
    }

    /* 获取角色和权限模块数据的方法 */
    getRoles(): void {
        this.http.get('assets/data/user-manage/role-manage.json').subscribe(res => {
            this.rolesData = res;
            this.copyData = res;
        });
        this.http.get('assets/data/user-manage/role-privilege.json').subscribe(res => this.rootData = res);
    }
    //查看详情执行的方法
    roleDet(rowData) {
        //隐藏底部按钮
        this.isFooter = false;
        //弹出详情框
        this.modalVisible = true;
        //使角色名称、描述、是否全选隐藏
        this.isShow = false;
        //设置表格中复选框不可点
        this.isChkDisabled = true;
        //为复选框赋值
        // this.send("getPrvgCm", rowData.privilege_map);
    }
    /* 添加角色权限之前执行的方法 */
    befAddRole() {
        //显示底部按钮
        this.isFooter = true;
        //设置弹框title
        this.addOrUpldRoleTitle = "添加角色";
        //重置表单
        this.role = {};
        window['$']('input:checkbox[value=r],input:checkbox[value=rw]').attr('checked', false);
        //设置标识ajaxType=post(添加)；ajaxType=put(修改)
        this.ajaxType = 'post';
        //使角色名称可修改
        this.isRolenameDisabled = false;
        //使角色名称、描述、是否全选显示
        this.isShow = true;
        //设置表格中复选框可点
        this.isChkDisabled = false;
        //弹出modal框
        this.modalVisible = true;
    }
    /*修改角色权限前执行的方法 */
    befEditRole(rowData) {
        //显示底部按钮
        this.isFooter = true;
        //设置弹框title
        this.addOrUpldRoleTitle = "编辑";
        //给表单赋值
        this.role = rowData;
        //设置标识ajaxType=post(添加)；ajaxType=put(修改)
        this.ajaxType = 'put';
        //显示弹出框
        this.modalVisible = true;
        //使角色名称不可修改
        this.isRolenameDisabled = true;
        //使角色名称、描述、是否全选显示
        this.isShow = true;
        //设置表格中复选框可点
        this.isChkDisabled = false;
    }
    /* 角色权限保存和修改 */
    addOrUplRole() {
        this.loading = true;
        if (this.role['name']) {
            this.http.put(`${this.rolesUrl}/${this.role['name']}`, this.role)
                .subscribe(
                    () => {
                        this.loading = false;
                        this.message.success('更新成功');
                    },
                    err => {
                        this.loading = false;
                        this.message.success('更新失败');
                    }
                );
        } else {
            if (this.rolesData.filter(data => data === this.role['name']).length) {
                this.message.warning('已存在该角色');
                return;
            }
            this.http.post(this.rolesUrl, this.role)
                .subscribe(
                    () => {
                        this.loading = false;
                        this.message.success('提交成功');
                    },
                    err => {
                        this.loading = false;
                        this.message.success('提交失败');
                    }
                );
        }
    }

    /* 角色权限删除 */
    delRole(rowIndex: number) {
        this.http.delete(`${this.rolesUrl}/${this.rolesData[rowIndex].id}`)
            .subscribe(
                () => {
                    this.rolesData = this.rolesData.filter(h => h !== this.rolesData[rowIndex]);
                    this.message.success('删除成功');
                },
                err => this.message.error('删除失败')
            );
    }
    /*以下为表格搜索和排序功能 */
    sortMap = {
        name: null,
        description: null
    };
    sortName = null;
    sortValue = null;
    nameVal = '';
    descriptionVal = '';
    search() {
        const filterFunc = (item) => {
            return (item.name.indexOf(this.descriptionVal) !== -1) && (item.name.indexOf(this.nameVal) !== -1)
        };
        this.rolesData = [...this.copyData.filter(item => filterFunc(item))];
        this.rolesData = [...this.rolesData.sort((a, b) => {
            if (a[this.sortName] > b[this.sortName]) {
                return (this.sortValue === 'ascend') ? 1 : -1;
            } else if (a[this.sortName] < b[this.sortName]) {
                return (this.sortValue === 'ascend') ? -1 : 1;
            } else {
                return 0;
            }
        })];
    }
    sort(sortName, value) {
        this.sortName = sortName;
        this.sortValue = value;
        Object.keys(this.sortMap).forEach(key => {
            if (key !== sortName) {
                this.sortMap[key] = null;
            } else {
                this.sortMap[key] = value;
            }
        });
        this.search();
    }
}