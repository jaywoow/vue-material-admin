import { ref, onBeforeMount, reactive } from 'vue';
import { ApiAuth } from '@/api/auth';
import type { MenuInterface } from '@/api/auth';

const useMenu = () => {
    const formRef = ref<any>();

    const data = reactive({
        form: {
            code: '',
            icon: '',
            name: '',
            path: '',
            redirect: '',
            component: '',
            show: true,
        },
        dialogTitle: 'New Menu',
        curId: 0,
        parentId: 0,
        visible: false,
        menuTree: [] as MenuInterface[],
    });
    const getMenutree = async () => {
        const res = await ApiAuth.menuTree();
        changeType(res.data);
        data.menuTree = res.data;
        console.log(formRef.value);
    };

    onBeforeMount(getMenutree);

    const changeType = (list: MenuInterface[]) => {
        list.forEach((item) => {
            item.type_ = item.type + '';
            // item.icon_ = item.icon + '';
            delete item.type;
            // delete item.icon;
            if (item.children) {
                changeType(item.children);
            }
        });
    };

    const onSubmit = async () => {
        console.log(formRef.value);
        const res = await formRef.value.validate();
        console.log(res);
        if (!res.valid) return;
        if (data.dialogTitle === 'dialogTitle') {
            onAdd();
        } else {
            onEdit();
        }
    };
    const onReset = async () => {
        await formRef.value.reset();
        data.visible = false;
    };

    const onAdd = async () => {
        await ApiAuth.addMenu(data.form);
        data.visible = false;
        getMenutree();
    };
    const onEdit = async () => {
        await ApiAuth.editMenu(data.curId, data.form);
        data.visible = false;
        getMenutree();
    };
    const onDel = async (id: any, dialog: any) => {
        await ApiAuth.delMenu(id);
        getMenutree();
        dialog.value = false;
    };

    const onMenu = (menu: any) => {
        data.form.icon = menu.item.icon;
        data.form.code = menu.item.code;
        data.form.name = menu.item.name;
        data.form.path = menu.item.path;
        data.form.redirect = menu.item.redirect;
        data.form.component = menu.item.component;
        data.form.show = menu.item.show;
        data.visible = true;
        data.curId = menu.item.id;
        data.dialogTitle = 'Edit Menu';
    };

    const onShowAddDialog = async (parentId = 0) => {
        // data.form.icon = '';
        // data.form.code = '';
        // data.form.name = '';
        // data.form.path = '';
        // data.form.redirect = '';
        // data.form.component = '';
        // data.form.show = true;
        data.parentId = parentId;
        data.visible = true;
        data.dialogTitle = 'New Menu';
    };

    return {
        formRef,
        data,
        onSubmit,
        onReset,
        onMenu,
        onDel,
        onShowAddDialog,
    };
};

export default useMenu;