define(['require'], function (require) {
    'use strict';

    function Node(value) {
        this.pre = null;
        this.next = null;
        this.value = value;
    }

    function List() {
        this.length = 0;
        this.head = null;
    }

    List.prototype.add = function (value) {
        var node = new Node(value);
        if (this.head == null) {
            this.head = node;
        } else {
            node.next = this.head;
            this.head.pre = node;
            this.head = node;
        }
        this.length++;
    };

    List.prototype.delete = function (value) {
        var node = this.head;
        while (node != null) {
            if (value == node.value) {
                if (node.pre != null) {
                    node.pre.next = node.next;
                }
                if (node.next != null) {
                    node.next.pre = node.pre;
                }
                this.length--;
                break;
            } else if (value == undefined) {
                this.head = this.head.next;
                if (this.head != null) {
                    this.head.pre = null;
                }
                this.length--;

                break;
            }
            node = node.next;
        }
    };

    List.prototype.iterate = function () {
        return new ListIterate(this.head);
    }

    function ListIterate(head) {
        this.head = head;
    }

    ListIterate.prototype.next = function () {
        var value = null;
        if (this.head != null) {
            value = this.head.value;
            this.head = this.head.next;
        }
        return value;
    }

    return List;
});