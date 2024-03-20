import java.util.ArrayList;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LinkedListTest {
    LinkedList<Integer> list = new LinkedList<>();

    @org.junit.jupiter.api.Test
    void get() {
        assertThrows(IndexOutOfBoundsException.class, () -> list.get(0));
        list.insertTail(1);
        list.insertTail(2);
        list.insertTail(3);
        assertEquals(1, list.get(0));
        assertEquals(2, list.get(1));
        assertEquals(3, list.get(2));
        assertThrows(IndexOutOfBoundsException.class, () -> list.get(3));
        assertEquals(1, list.get(-0));
        assertEquals(3, list.get(-1));
        assertEquals(2, list.get(-2));
        assertEquals(1, list.get(-3));
        assertThrows(IndexOutOfBoundsException.class, () -> list.get(-4));
    }

    @org.junit.jupiter.api.Test
    void getHead() {
        assertThrows(NoSuchElementException.class, () -> list.getHead());
        list.insertTail(1);
        list.insertTail(2);
        list.insertTail(3);
        assertEquals(1, list.getHead());
    }

    @org.junit.jupiter.api.Test
    void getTail() {
        assertThrows(NoSuchElementException.class, () -> list.getTail());
        list.insertTail(1);
        list.insertTail(2);
        list.insertTail(3);
        assertEquals(3, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void insert() {
        assertThrows(IndexOutOfBoundsException.class, () -> list.insert(2, 1));
        list.insert(0, 1);
        list.insert(1, 2);
        list.insert(2, 3);
        assertEquals(1, list.get(0));
        assertEquals(2, list.get(1));
        assertEquals(3, list.get(2));
        list.insert(0, 11);
        assertEquals(11, list.get(0));
        assertThrows(IndexOutOfBoundsException.class, () -> list.insert(-2, 1));

        assertEquals(11, list.getHead());
        assertEquals(3, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void insertTail() {
        list.insertTail(11);
        list.insertTail(12);
        assertEquals(11, list.get(0));
        assertEquals(12, list.get(1));

        assertEquals(11, list.getHead());
        assertEquals(12, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void insertHead() {
        list.insertHead(11);
        list.insertHead(12);
        assertEquals(12, list.get(0));
        assertEquals(11, list.get(1));

        assertEquals(12, list.getHead());
        assertEquals(11, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void remove() {
        assertThrows(IndexOutOfBoundsException.class, () -> list.remove(-1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.remove(0));
        assertThrows(IndexOutOfBoundsException.class, () -> list.remove(1));
        list.insert(0, 1);
        list.insert(1, 2);
        list.insert(2, 3);
        assertThrows(IndexOutOfBoundsException.class, () -> list.remove(-1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.remove(3));

        list.remove(0);
        assertEquals(2, list.get(0));
        assertEquals(3, list.get(1));
        list.insert(0,1);

        list.remove(1);
        assertEquals(1, list.get(0));
        assertEquals(3, list.get(1));
        list.insert(1,2);

        list.remove(2);
        assertEquals(1, list.get(0));
        assertEquals(2, list.get(1));
        list.insert(2,3);

        assertEquals(1, list.getHead());
        assertEquals(3, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void reverse() {
        list.reverse();

        list.insert(0, 1);
        list.insert(1, 2);
        list.insert(2, 3);

        list.reverse();
        assertEquals(3, list.get(0));
        assertEquals(2, list.get(1));
        assertEquals(1, list.get(2));

        assertEquals(3, list.getHead());
        assertEquals(1, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void set() {
        assertThrows(IndexOutOfBoundsException.class, () -> list.set(-1, 1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.set(0, 1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.set(1, 1));

        list.insert(0, 1);
        list.insert(1, 2);
        list.insert(2, 3);

        assertThrows(IndexOutOfBoundsException.class, () -> list.set(-1, 1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.set(3, 1));

        list.set(0, 4);
        list.set(1, 5);
        list.set(2, 6);

        assertEquals(4, list.get(0));
        assertEquals(5, list.get(1));
        assertEquals(6, list.get(2));

        assertEquals(4, list.getHead());
        assertEquals(6, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void addAll() {
        // 感觉本测试还不够完善
        ArrayList<Integer> a = new ArrayList<>();
        a.add(11);
        a.add(12);
        a.add(13);
        a.add(14);
        list.addAll(a);

        assertEquals(11, list.get(0));
        assertEquals(12, list.get(1));
        assertEquals(13, list.get(2));
        assertEquals(14, list.get(3));

        assertEquals(11, list.getHead());
        assertEquals(14, list.getTail());
    }

    @org.junit.jupiter.api.Test
    void insertLinkedList() {
        LinkedList<Integer> list1 = new LinkedList<>();
        list1.insert(0, 1);
        list1.insert(1, 2);
        list1.insert(2, 3);

        assertThrows(IndexOutOfBoundsException.class, () -> list.insertLinkedList(list1, -1));
        assertThrows(IndexOutOfBoundsException.class, () -> list.insertLinkedList(list1, 1));

        list.insertLinkedList(list1, 0);
        assertEquals(1, list.get(0));
        assertEquals(2, list.get(1));
        assertEquals(3, list.get(2));

        assertEquals(1, list.getHead());
        assertEquals(3, list.getTail());

        LinkedList<Integer> list2 = new LinkedList<>();
        list.insertLinkedList(list2, 2);
    }
}