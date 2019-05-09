// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'vue-todoapp_2';
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );
        todos.forEach(function (todo, index) {
            todo.id = index
        });
        todoStorage.uid = todos.length;
        return todos;
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};

const app = new Vue({
    el: '#app',
    data: {
        // 使用するデータ
        todos: [],
        current: -1,
        options: [
            {value: -1, label: 'All'},
            {value: 0, label: 'In Progress'},
            {value: 1, label: 'Done'},
        ]
    },
    computed: {
        filterTodos: function () {
            // stateが-1なら全て
            // それ以外ならstate値に応じたtodoを表示する
            return this.todos.filter(function (el) {
                return this.current < 0 ? true : this.current === el.state
            }, this)
        },
        labels() {
            return this.options.reduce(function (a, b) {
                return Object.assign(a, {[b.value]: b.label})
            }, {})
            // キーから見つけやすいように、次のように加工したデータを作成
            // {0: '作業中', 1: '完了', -1: 'すべて'}
        }
    },
    watch: {
        todos: {
            handler: function (todos) {
                todoStorage.save(todos);
            },
            deep: true
        }
    },
    created() {
        this.todos = todoStorage.fetch()
    },
    methods: {
        // 使用するメソッド
        // commentを新規追加する
        doAdd: function (event, value) {
            var comment = this.$refs.comment;

            if (!comment.value.length) {
                return;
            }

            // 新規コメントをtodosリストにpush
            // stateはdefaultを0にて設定
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            });

            comment.value = '';
        },
        // stateを変更
        doChangeState: function (item) {
            item.state = item.state ? 0 : 1;
        },
        doRemoveItem: function (item) {
            var index = this.todos.indexOf(item);
            this.todos.splice(index, 1);
        }
    }
});