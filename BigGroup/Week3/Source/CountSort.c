#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void counting_sort(int* arr, int len) {
    // 获得最大值最小值
    // 偏移量即最小值
    int max = arr[0], min = arr[0];
    for (int i = 0; i < len; ++i) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    // 计算计数数组长度
    const int cnt_len = max - min + 1;
    int* cnt = (int*) malloc(sizeof(int) * cnt_len);
    memset(cnt, 0, sizeof(int)*cnt_len);

    // 以下均得考虑偏移量
    // 遍历 arr，计数
    for (int i = 0; i < len; ++i) ++cnt[arr[i]-min];
    
    // 计数数组 -> 索引数组
    for (int i = 0; i < cnt_len; ++i) cnt[i] += cnt[i-1];
    int* ind = cnt;

    // 拷贝临时数组
    int* arr_bak = (int*) malloc(sizeof(int) * len);
    for (int i = 0; i < len; ++i) arr_bak[i] = arr[i];
    
    // 反向取结果(应为索引是减小，从大到小，对应从后向前)
    for (int i = len - 1; i >= 0; --i) {
        arr[--ind[arr_bak[i]-min]] = arr_bak[i];
    }

    free(arr_bak);
    free(cnt);
}


int main(){
    int a[5] = {1, 7, 3, 9, 4};
    printf("input:");
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
    printf("\noutput:");
    counting_sort(a, 5);
    for(int i = 0; i < 5; ++i) {
        printf("%d", a[i]);
    }
}