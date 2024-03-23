#include <iostream>
#include <functional>
#include <cstdlib>
#include "linkstark.hpp"
#include <cassert>

void printData(int& data) {
    std::cout << data << std::endl;
}

void sumUp(int& element, int& sum){
    sum += element;
}

int main() {
    system("chcp 65001");
    // 创建一个整型链栈
    LinkStack<int> stack;

    // 测试空栈检测
    assert(stack.isEmpty());
    std::cout << "空栈检测通过" << std::endl;

    // 测试获取元素个数
    assert(stack.getSize() == 0);
    std::cout << "获取元素个数测试通过" << std::endl;

    // 入栈操作
    stack.push(10);
    stack.push(20);
    stack.push(30);

    // 测试获取栈顶元素
    assert(stack.getTopData() == 30);
    std::cout << "获取栈顶元素测试通过" << std::endl;

    // 测试栈的大小
    assert(stack.getSize() == 3);
    std::cout << "获取栈的大小测试通过" << std::endl;

    // 出栈操作
    int poppedElement = stack.pop();
    assert(poppedElement == 30);
    std::cout << "出栈操作测试通过" << std::endl;

    // 再次获取栈顶元素并打印
    assert(stack.getTopData() == 20);
    std::cout << "再次获取栈顶元素测试通过" << std::endl;

    // 再次测试栈的大小
    assert(stack.getSize() == 2);
    std::cout << "再次获取栈的大小测试通过" << std::endl;

    stack.push(10);
    stack.push(20);
    stack.push(30);

    // 测试traverse
    std::cout << "traverse print（单参数） 测试" << std::endl;
    stack.traverse(printData);

    int sum = 0;
    stack.traverse(sumUp, sum);
    // 预期结果为 
    assert(sum == 90);
    std::cout << "traverse sumUp（双参数）测试通过！" << std::endl;

    // 清空栈
    while (!stack.isEmpty()) {
        stack.pop();
    }

    // 再次测试空栈检测
    assert(stack.isEmpty());
    std::cout << "再次测试空栈检测通过" << std::endl;

    // 再次测试获取栈的大小
    assert(stack.getSize() == 0);
    std::cout << "再次获取栈的大小测试通过" << std::endl;

    std::cout << ">_\n所有断言测试通过！" << std::endl;

    system("pause");

    return 0;
}
