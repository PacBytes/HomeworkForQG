#include <iostream>
#include <sstream>
#include <cstdlib>
#include "linkstark.hpp"
using namespace std;

// 判断字符是否是操作符
bool isOperator(char c){
    return c == '+' || c == '-' || c == '*' || c == '/';
}

bool isRightInfixExpresstion(string infixExpresstion) {
    return infixExpresstion.find("/0") == string::npos;
}

void getMaxOp(char& opInStack, char& maxOp){
    
    if (opInStack == '*' || opInStack == '/'){
        maxOp = opInStack;
    }
}
// 获取操作符的优先级，这里只需要考虑 + - * / 因为()单独考虑了
bool isLowPriority(char op, LinkStack<char>& stark){
    // 判空，乘除最高
    
    
    if (stark.getSize() == 0 || op == '*' || op == '/') return false;
    char maxOp = ' ';
    
    stark.traverse(getMaxOp, maxOp);
    
    if (maxOp == '*' || maxOp == '/') return true;
    return false;
}

// 计算两个操作数的结果
double applyOperator(double num1, double num2, char op){
    cout << "Now calculate ";
    cout << num1;
    cout << op;
    cout << num2;
    cout << endl;
    switch (op)
    {
    case '+':
        return num1 + num2;
        break;
    case '-':
        return num1 - num2;
        break;
    case '*':
        return num1 * num2;
        break;
    case '/':
        return num1 / num2;
        break;
    }
    return EXIT_FAILURE;
}

// 出栈所有运算符
string popAll(LinkStack<char>& stark) {
    string result;
    while (stark.getSize() != 0) {
        result.push_back(stark.pop());
    }
    return result;
}

// 检查后缀表达式是否合法
bool isRightPostfixExpresstion(string infixExpresstion) {
    int opNum = 0;
    int otherNum = 0;
    istringstream iss(infixExpresstion);
    char ch;
    while (iss >> ch) {
        if (isOperator(ch)) ++opNum;
        else ++otherNum;
    }
    return otherNum == opNum +1;
}
// 中缀表达式流转后缀表达式
// 增加 size 用于初始化 string 大小，这样减少动态扩容的过程
string infixStreamToPostfix(istringstream& iss, size_t length){    
    // 建立存操作符的链栈
    LinkStack<char> operatorStack;
    // 创建存结果的字符串
    string postfixExpression;
    postfixExpression.reserve(length);
    // 对于每一个字符
    char ch;
    while (iss >> ch) {
        
        // 数字直接输出到结果，添加字母支持
        if (isdigit(ch) || isalpha(ch)) {
            postfixExpression.push_back(ch);
        }
        // 操作符入栈
        else if (isOperator(ch)) {
            // 遇到更高优先级的运算符，出栈运算符到字符串，再压入新运算符
            if (isLowPriority(ch, operatorStack)) {
                postfixExpression.append(popAll(operatorStack));
            }
            operatorStack.push(ch);
        }
        // 遇到括号，找到右括号，递归调用函数，输出到结果
        else if (ch == '(') {
            postfixExpression.append(infixStreamToPostfix(iss, length));
        }
        else if (ch == ')') {
            postfixExpression.append(popAll(operatorStack));
            return postfixExpression;
        }
    }
    // 直到所有操作符出栈即结束
    postfixExpression.append(popAll(operatorStack));
    
    return postfixExpression;
}

// 中缀表达式转后缀表达式
string infixToPostfix(const string& infixExpression){
    if (!isRightInfixExpresstion(infixExpression)) {
        cout << "非法输入1!!!" << endl;
        return " ";
    }
    istringstream iss(infixExpression);
    string res = infixStreamToPostfix(iss, infixExpression.length());
    if (!isRightPostfixExpresstion(res)) {
        cout << "非法输入2!!!" << endl;
        return " ";
    }
    cout << res << endl;
    return res;
}

// 计算后缀表达式的函数
double evaluatePostfix(const string& postfixExpression) {
    if (!isRightPostfixExpresstion(postfixExpression)) {
        cout << "非法输入3!!!" << endl;
        return EXIT_FAILURE;
    }
    // 从左往右读取，存入数字栈，遇到操作符就取出进行操作，再压栈
    LinkStack<double> numStack;
    istringstream iss(postfixExpression);
    
    char ch;
    while (iss >> ch) {
        if(isdigit(ch)) {
            numStack.push(ch - '0');
        }
        else if(isOperator(ch)) {
            double num2 = numStack.pop(); // 重要！！要不除法会反过来
            double num1 = numStack.pop();
            numStack.push(applyOperator(num1, num2, ch));
        }
    }
    double res = numStack.pop();
    cout << res << endl;
    return res;
};

// 计算中缀表达式的函数
double evaluateInfix(const string& infixExpression){
    return evaluatePostfix(infixToPostfix(infixExpression));
}

// 显示菜单选项
void displayMenu() {
    cout << "\n--------------------\n[中缀后缀表达式计算器]\n\n菜单：" << endl;
    cout << "1. 中缀表达式转后缀表达式(支持字母)(如：a*(b*c+a)+c)" << endl;
    cout << "2. 中缀表达式计算（如：1*(2+3)/3" << endl;
    cout << "3. 后缀表达式计算（如：123*1+*3+）" << endl;
    cout << "Q. 退出" << endl;
}

int main() {
    system("chcp 65001");
    cout << " _____  _       ___  _____ " << endl;
    cout << "/  __ \\| |     / _ \\/  __ \\" << endl;
    cout << "| /  \\/| |    / /_\\ \\ /  \\/" << endl;
    cout << "| |    | |    |  _  | |    " << endl;
    cout << "| \\__/\\| |____| | | | \\__/\\" << endl;
    cout << "\\____/\\_____/\\_| |_/\\____/ " << endl;                   
    
    char choice;

    do {
        // 显示菜单
        displayMenu();

        // 获取用户选择
        cout << "请选择操作: ";
        cin >> choice;

        // 根据用户选择执行相应操作
        string expresstion;
        string res;
        switch (choice) {
            case '1':
                cout << "请输入表达式：" << endl;
                cin >> expresstion;
                cout << "\n结果" << endl;
                res = infixToPostfix(expresstion);
                if (res.empty()) cout << "非法输入4!!!" << endl;
                break;
            case '2':
                cout << "请输入表达式：" << endl;
                cin >> expresstion;
                cout << "\n结果" << endl;
                evaluateInfix(expresstion);
                break;
            case '3':
                cout << "请输入表达式：" << endl;
                cin >> expresstion;
                cout << "\n结果" << endl;
                evaluatePostfix(expresstion);
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