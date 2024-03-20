import java.util.Collection;
import java.util.NoSuchElementException;


public class LinkedList<T> {
    int size;
    Node<T> head;
    Node<T> tail;

    public LinkedList() {
        this.size = 0;
        head = null;
        tail = null; // 尾元素引用，方便尾插
    }

    // 为作业而编写，自己写的这个 LinkedList 因为是封装了的，Node 为私有属性，所以不可能成环
    public LinkedList<Integer> getLoopIntegerList(int num, int entranceIndex) {
        LinkedList<Integer> list = new LinkedList<>();
        for (int data = 1; data <= num; ++data) {
            list.insertTail(data);
        }

        list.tail.next = list.Node(entranceIndex);
        return list;
    }

    // 链表有环判断以及入口索引获取，返回 -1 则无环
    public int hasLoop() {
        if (this.size == 0) {
            return -1;
        }

        Node<T> fast = this.head;
        Node<T> slow = this.head;

        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            assert slow != null;
            slow = slow.next;

            if (fast == slow) {
                Node<T> x = this.head;
                int index = 0;
                while (slow != null && x != null) {
                    // 先判断相等，再走，再增加索引，否则通不过 a=0/1 的测试点
                    if (x == slow) {
                        return index;
                    }

                    slow = slow.next;
                    x = x.next;

                    ++index;
                }
            }
        }
        return -1;
    }

    // 链表中点
    public int getMidIndexByCalculate(){
        Node<T> fast = this.head;
        int index = 0;
        while (fast != null && fast.next != null && fast.next.next != null) {
            fast = fast.next.next;
            ++index;
        }
        return index;
    }

    // 奇偶互换
    public void change(){
        if (this.size >= 2) {
            Node<T> first = this.head;
            Node<T> mid = first.next;
            Node<T> last = mid.next;

            // 左边界处理
            first.next = mid.next;
            mid.next = first;
            this.head = mid;

            this.tail = last;

            if (this.size == 2 || this.size == 3) {
                return;
            }

            // 步进 1
            mid = first.next;
            last = mid.next;

            // 中间部分处理
            while (true) {
                mid.next = last.next;
                last.next = mid;
                first.next = last;

                if (mid.next == null) {
                    this.tail = mid;
                    return;
                } else if (mid.next.next == null) {
                    this.tail = mid.next;
                    return;
                }

                first = mid;
                mid = first.next;
                last = mid.next;
            }
        }
    }

    // 方法：实现增删改查、addAll、insertLinkedList

    // 查找节点
    public T get(int index) {
        Node<T> x = Node(index);
        return x.data;
    }
    private Node<T> Node(int index) {
        // 负值索引变正值
        if (index < 0) {
            // 用特值法，思考三个元素的情况，不难得到计算方法
            index = this.size + index;
        }

        checkElementIndex(index);

        Node<T> cur = this.head;
        for (int i = 0; i < index; ++i) {
            cur = cur.next;
        }
        return cur;
    }

    public T getHead() {
        if (this.head != null) {
            return this.head.data;
        } else {
            throw new NoSuchElementException();
        }
    }

    public T getTail() {
        if (this.tail != null) {
            return this.tail.data;
        } else {
            throw new NoSuchElementException();
        }
    }

    // 插入数据
    public void insert(int index, T data) {
        checkPositionIndex(index);
        if (index == this.size) {
            insertTail(data);
        } else if (index == 0) {
            insertHead(data);
        } else { // 中间插
            // 定位到对应节点
            Node<T> prev = Node(index-1);
            // 插入元素
            Node<T> cur = prev.next;
            prev.next = new Node<>(data, cur);
            ++this.size;
        }
    }

    private boolean insertFirst(T data) {
        if (this.size == 0) {
            this.head = new Node<>(data, null);
            this.tail = this.head;
            ++this.size;
            return true;
        }
        return false;
    }
    public void insertTail(T data) {
        if (!insertFirst(data)) {
            Node<T> newNode = new Node<>(data, null);
            this.tail.next = newNode;
            this.tail = newNode;

            ++this.size;
        }
    }

    public void insertHead(T data) {
        if (!insertFirst(data)) {
            this.head = new Node<>(data, this.head);
            ++this.size;
        }
    }

    public void remove(int index) {
        checkElementIndex(index);

        if (this.size == 0) {
            return;
        }

        Node<T> d;
        // 删除头元素
        if (index == 0) {
            d = this.head;
            this.head = d.next;
        } else {
            // 删除中间元素或尾元素
            Node<T> prev = Node(index-1);
            d = prev.next;
            prev.next = d.next;
            if (index == this.size) {
                this.tail = prev;
            }
        }

        // 清理 d 以及改变 size
        d.data = null;
        d.next = null;
        --this.size;
    }

    // 打印所有元素
    public void print() {
        if (this.size > 0) {
            Node<T> cur = this.head;
            while (cur != null) {
                System.out.print(cur.data.toString() + " -> ");
                cur = cur.next;
            }
            System.out.println();
        }
    }

    // 反转链表
    public void reverse() {
        if (this.size  >= 2) {
            Node<T> first = this.head;
            Node<T> mid = first.next;
            Node<T> last = mid.next;

            // 头结点处理
            first.next = null;

            while (last != null) {
                mid.next = first;

                first = mid;
                mid = last;
                last = last.next;
            }

            // 尾节点处理
            mid.next = first;

            // 交换头尾节点引用
            Node<T> tmp;
            tmp = this.head;
            this.head = this.tail;
            this.tail = tmp;
        }
    }

    public void set(int index, T data) {
        checkElementIndex(index);

        Node<T> cur = Node(index);
        cur.data = data;
    }

    public void addAll(Collection<? extends T> c) {
        addAll(0, c);
    }

    public void addAll(int index, Collection<? extends T> c) {
        checkPositionIndex(index);

        Object[] o = c.toArray(); // 统一操作，获取元素个数
        int addSize = o.length;
        if (addSize == 0) {
            return;
        }

        // 构建链表
        LinkedList<T> list = new LinkedList<>();
        for (Object obj : o){
            @SuppressWarnings("unchecked") // 忽略泛型转换警告
            T data = (T) obj;
            list.insertTail(data);
        }

        this.insertLinkedList(list, index);
    }

    public void insertLinkedList(LinkedList<T> list, int index) {
        checkPositionIndex(index);

        if (list.size == 0) {
            return;
        }

        if (this.size == 0) {
            this.head = list.head;
            this.tail = list.tail;
            this.size += list.size;
            return;
        }

        if (index == 0) {
            list.tail.next = this.head;
            this.head = list.head;
        } else if(index == this.size) {
            this.tail.next = list.head;
            this.tail = list.tail;
        } else {
            Node<T> xPrev = Node(index-1);
            Node<T> x = xPrev.next;
            xPrev.next = list.head;
            list.tail.next = x;
        }

        this.size += list.size;
    }


    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data, Node<T> next) {
            this.data = data;
            this.next = next;
        }
    }

    // 学习大佬的索引封装，确实代码逻辑清晰了太多
    private boolean isElementIndex(int index) {
        return index >= 0 && index < this.size;
    }

    private boolean isPositionIndex(int index) {
        return index >= 0 && index <= this.size;
    }

    private String outOfBoundsMsg(int index) {
        return "Index: " + index + ", Size: " + this.size;
    }

    private void checkElementIndex(int index) {
        if (!this.isElementIndex(index)) {
            throw new IndexOutOfBoundsException(this.outOfBoundsMsg(index));
        }
    }

    private void checkPositionIndex(int index) {
        if (!this.isPositionIndex(index)) {
            throw new IndexOutOfBoundsException(this.outOfBoundsMsg(index));
        }
    }
}
