#ifndef LINK_STARK_H
#define LINK_STARK_H
#include <iostream>
#include <functional>

// 通用链栈节点
template<typename T>
struct Node {
    T data;
    Node<T>* next;
};

// 链栈类
template<typename T>
class LinkStack {
private:
    Node<T>* top; // 栈顶，采用指针更好处理 NULL
    size_t size;
public:
    LinkStack():
        top(nullptr), // 初始化 top 为 nullptr
        size(0) // 初始化长度
    {}

    // 析构
    ~LinkStack(){
        while (!isEmpty()) {
            pop();
        }
    }

    // 元素为空检测
    bool isEmpty() const {
        return size == 0;
    }



    // 获取元素个数
    size_t getSize() const {
        return size;
    }

    // 入栈
    void push(const T&data){
        Node<T>* newNode = new Node<T>; // 申请节点空间
        newNode->data = data; // 赋值
        newNode->next = top; // 设置 next
        top = newNode; // 重置 top
        ++size;
    }


    // 出栈
    T pop() {
        // 空栈检测
        if (isEmpty()) {
            std::cout << "栈里没有元素，没有元素出栈" << std::endl;
            return T(); // 返回默认构造的值
        }
        // 存储栈顶节点数据
        T data = top->data;
        // 删除栈顶节点并重置栈顶
        Node<T>* x = top;
        top = top->next;
        delete x;

        --size;
        // 返回栈顶节点数据
        return data;
    }

    // 获取栈顶数据
    T getTopData() const {
        // 空栈检测
        if (isEmpty()) {
            std::cout << "栈里没有元素！！！" << std::endl;
            return T(); // 返回默认构造的值
        }
        return top->data;
    }

    void traverse(std::function<void(T&, T&)> operate, T& data2){
        Node<T>* x  = top;
        while (x != NULL) {
            operate(x->data, data2);
            x = x->next;
        }
    }

    void traverse(std::function<void(T&)> operate){
        Node<T>* x  = top;
        while (x != NULL) {
            operate(x->data);
            x = x->next;
        }
    }
};



#endif