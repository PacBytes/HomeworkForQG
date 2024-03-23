#include <iostream>
#include <cassert>
#include <functional>
using namespace std;

template <typename T>
struct Node {
    T data;
    Node<T>* prev;
    Node<T>* next;
    // 提供方便的构造方法
    Node(const T& value):
        data(value),
        prev(nullptr),
        next(nullptr)
    {}
};

template <typename T>
class Queue {
private:
    Node<T>* head;
    Node<T>* tail;
    int size;
    int maxLength;

public:
    // 构造
    Queue(int maxLength = -1): // 队列长度为 -1 时候不限制
    head(nullptr),
    tail(nullptr),
    size(0),
    maxLength(maxLength)
    {}

    // 析构
    ~Queue() {
        ClearQueue();
    }

    // 尾入队
    void EnQueue(const T& value) {
        // 判满
        if (IsFullQueue()) {
            cout << "队列已满!" << endl;
            return;
        }
        // 构造节点并连接
        Node<T>* newNode = new Node<T>(value);
        // 空队列处理
        if (isEmptyQueue()) {
            head = tail = newNode;
        } else {
            tail->next = newNode;
            newNode->prev = tail;
            tail = newNode;
        }
        // 增长
        size++;
    }

    // 头出队
    T DeQueue() {
        // 判空
        if (isEmptyQueue()) {
            cout << "队列为空!" << endl;
            return T();
        }
        // 移动头结点
        Node<T>* tmp = head;
        T value = head->data;
        head = head->next;
        if (head != nullptr) {
            head->prev = nullptr;
        } else {
            tail = nullptr; // 队列为空，尾指针也修改为空指针
        }
        // 删除原头结点
        delete tmp;
        // 自减
        size--;
        return value;
    }

    // 清空队列
    void ClearQueue() {
        while (!isEmptyQueue()) {
            DeQueue();
        }
    }

    // 查看队头
    T GetHeadQueue() const {
        if (isEmptyQueue()) {
            cout << "队列为空!" << endl;
            return T(); //返回默认构造值
        }
        return head->data;
    }

    // 判满（有限制的情况下）
    bool IsFullQueue() const {
        return (maxLength != -1) && (size >= maxLength);
    }

    // 判空
    bool isEmptyQueue() const {
        return size == 0;
    }

    // 获取长度
    int LengthQueue() const {
        return size;
    }

    // 遍历并操作，单参数
    void TraverseQueue(function<void(T)> foo) const {
        cout << "( ";
        Node<T>* x = head;
        while (x != nullptr) {
            foo(x->data);
            x = x->next;
        }
        cout << " )";
    }
};

void printInt(int x) {
    cout << x << " <- ";
}

// 显示菜单选项
void displayMenu() {
    cout << "-------测试-------" << endl;
    cout << "1. 判空" << endl;
    cout << "2. 入队" << endl;
    cout << "3. 出队" << endl;
    cout << "4. 查看队列头" << endl;
    cout << "5. 判满" << endl;
    cout << "6. 清空" << endl;
    cout << "7. 获取队列长度" << endl;
    cout << "Q. 退出" << endl;
}

int main() {
    system("chcp 65001");

    cout << "   ____                        " << endl;
    cout << "  / __ \\                       " << endl;
    cout << " | |  | |_   _  ___ _   _  ___ " << endl;
    cout << " | |  | | | | |/ _ \\ | | |/ _ \\" << endl;
    cout << " | |__| | |_| |  __/ |_| |  __/" << endl;
    cout << "  \\___\\_\\\\__,_|\\___|\\__,_|\\___|" << endl;
    cout << "                               " << endl;

    // 构造测试
    cout << "构造测试\n" << endl;
    cout << "请输入队列最大长度：";
    int maxLength;
    cin >> maxLength;

    cout << "构造队列中..." << endl;
    Queue<int> q(maxLength);
    
    cout << "当前队列：";
    q.TraverseQueue(printInt);
    cout << endl;

    char choice;

    do {
        // 显示菜单
        displayMenu();

        // 获取用户选择
        cout << "请选择操作: ";
        cin >> choice;

        // 根据用户选择执行相应操作
        switch (choice) {
            case '1':
                cout << "队列是否为空: " << (q.isEmptyQueue() ? "是" : "否") << endl;
                break;
            case '2': {
                int value;
                cout << "请输入要入队的元素值: ";
                cin >> value;
                q.EnQueue(value);
                cout << "当前队列：";
                q.TraverseQueue(printInt);
                cout << endl;
                break;
            }
            case '3':
                if (!q.isEmptyQueue()) {
                    cout << "出队的元素为: " << q.DeQueue() << endl;
                    cout << "当前队列：";
                    q.TraverseQueue(printInt);
                    cout << endl;
                } else {
                    cout << "队列为空，无法出队。" << endl;
                }
                break;
            case '4':
                if (!q.isEmptyQueue()) {
                    cout << "队列头元素为: " << q.GetHeadQueue() << endl;
                } else {
                    cout << "队列为空，无队列头元素。" << endl;
                }
                break;
            case '5':
                cout << "队列是否满: " << (q.IsFullQueue() ? "是" : "否") << endl;
                break;
            case '6':
                q.ClearQueue();
                cout << "队列已清空。" << endl;
                cout << "当前队列：";
                q.TraverseQueue(printInt);
                cout << endl;
                break;
            case '7':
                cout << "当前队列长度为: " << q.LengthQueue() << endl;
                break;
            case 'q':
            case 'Q':
                cout << "退出程序." << endl;
                break;
            default:
                cout << "无效的选择，请重试。" << endl;
        }
    } while (choice != 'q' && choice != 'Q');

    return 0;
}