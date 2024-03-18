import java.util.Collection;
import java.util.NoSuchElementException;


public class LinkedList<T> {
    int size;
    // 有头有尾，方便从尾部移动，也方便头插尾插
    Node<T> head;
    Node<T> tail;

    public LinkedList() {
        this.size = 0;
        head = null;
        tail = null;
    }

    // 方法：实现增删改查、addAll、insertLinkedList

    // 查找节点
    // 由于是双向链表，这里分前后方向来查找，提高效率
    // 支持负值索引（从反方向）
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

        Node<T> cur;
        int i;

        // 检查索引在前半部分还是后半部分
        if (index < (this.size >> 1)){
            cur = this.head;

            for (i = 0; i < index; ++i) {
                cur = cur.next;
            }

            return cur;
        } else {
            cur = this.tail;

            for (i = this.size - 1; i > index; --i) {
                cur = cur.prev;
            }

            return cur;
        }
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
            Node<T> cur = Node(index);
            // 插入元素
            Node<T> prev = cur.prev;
            Node<T> newNode = new Node<>(prev, data, cur);
            prev.next = newNode;
            cur.prev = newNode;
            ++this.size;
        }
    }

    private boolean insertFirst(T data) {
        if (this.size == 0) {
            Node<T> newNode = new Node<>(null, data, null);
            this.head = newNode;
            this.tail = newNode;
            ++this.size;
            return true;
        }
        return false;
    }
    public void insertTail(T data) {
        if (!insertFirst(data)) {
            Node<T> newNode = new Node<>(tail, data, null);
            this.tail.next = newNode;
            this.tail = newNode;
            ++this.size;
        }
    }

    public void insertHead(T data) {
        if (!insertFirst(data)) {
            Node<T> newNode = new Node<>(null, data, head);
            this.head.prev = newNode;
            this.head = newNode;
            ++this.size;
        }
    }

    public void remove(int index) {
        checkElementIndex(index);

        if (this.size == 0) {
            return;
        }

        Node<T> d = Node(index);
        Node<T> prev = d.prev;
        Node<T> next = d.next;

        // d 为头元素 / 尾元素
        if (prev == null) {
            next.prev = null;
            this.head = next;
        } else if (next == null) {
            prev.next = null;
            this.tail = prev;
        } else {
            prev.next = next;
            next.prev = prev;
        }

        d.prev = null;
        d.data = null;
        d.next = null;

        --this.size;
    }

    // 打印所有元素
    public void print() {
        if (this.size > 0) {
            Node<T> cur = this.head;
            while (cur != null) {
                System.out.print(cur.data.toString() + " ");
                cur = cur.next;
            }
            System.out.println();
        }
    }

    // 逆序链表
    public void reverse() {
        Node<T> tmp;

        tmp = this.head;
        this.head = this.tail;
        this.tail = tmp;

        Node<T> cur = this.head;
        for (int i = 0; i < this.size; ++i) {
            tmp = cur.next;
            cur.next = cur.prev;
            cur.prev = tmp;

            cur = cur.next; // 已经修正了，所以用的是 next
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
            this.head.prev = list.tail;
            this.head = list.head;
        } else if(index == this.size) {
            list.head.prev = this.tail;
            this.tail.next = list.head;
            this.tail = list.tail;
        } else {
            Node<T> x = Node(index);
            Node<T> xPrev = x.prev;
            list.head.prev = xPrev;
            xPrev.next = list.head;
            list.tail.next = x;
            x.prev = list.tail;
        }

        this.size += list.size;
    }


    private static class Node<T> {
        T data;
        Node<T> next;
        Node<T> prev;

        Node(Node<T> prev, T data, Node<T> next) {
            this.data = data;
            this.next = next;
            this.prev = prev;

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
