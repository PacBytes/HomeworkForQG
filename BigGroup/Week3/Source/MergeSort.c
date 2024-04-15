#include <stdio.h>

void merge(int *l1, int *e1, int *l2, int *e2, int *res) {
  while (l1 != e1 && l2 != e2) {
    if (*l2 < *l1) {
      *res = *l2;
      ++l2;
    } else {
      *res = *l1;
      ++l1;
    }
    ++res;
  }
  for (; l1 != e1; ++l1, ++res) *res = *l1;
  for (; l2 != e2; ++l2, ++res) *res = *l2;
}

void merge_sort(int *a, int l, int r) {
  if (r - l <= 1) return;
  // 分解
  int mid = l + ((r - l) >> 1);
  merge_sort(a, l, mid), merge_sort(a, mid, r);
  // 合并
  int tmp[1024] = {};
  merge(a + l, a + mid, a + mid, a + r, tmp + l);
  for (int i = l; i < r; ++i) a[i] = tmp[i];
}


int main(){
    int a[5] = {1, 7, 3, 9, 4};
    printf("input:");
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
    printf("\noutput:");
    merge_sort(a, 0, 5);
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
}