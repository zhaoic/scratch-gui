import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import SelectorComponent from '../components/asset-panel/selector.jsx';

class Selector extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddSortable',
            'handleRemoveSortable'
        ]);

        this.sortableRefs = [];
        this.boxes = null;
    }

    componentWillReceiveProps (newProps) {
        if (newProps.dragInfo.dragging && !this.props.dragInfo.dragging) {
            // Drag just started, snapshot the sorted bounding boxes for sortables.
            this.boxes = this.sortableRefs.map(el => el && el.getBoundingClientRect());
            this.boxes.sort((a, b) => a.top - b.top);
        } else if (!newProps.dragInfo.dragging && this.props.dragInfo.dragging) {
            this.props.onDrop(Object.assign({},
                this.props.dragInfo, {newIndex: this.getMouseOverIndex()}));
        }
    }

    handleAddSortable (node) {
        this.sortableRefs.push(node);
    }

    handleRemoveSortable (node) {
        const index = this.sortableRefs.indexOf(node);
        this.sortableRefs = this.sortableRefs.slice(0, index)
            .concat(this.sortableRefs.slice(index + 1));
    }

    getOrdering (items, draggingIndex, newIndex) {
        // An "Ordering" is an array of indices, where the position array value corresponds
        // to the position of the item in props.items, and the index of the value
        // is the index at which the item should appear.
        // That is, if props.items is ['a', 'b', 'c', 'd'], and we want the GUI to display
        // ['b', 'c', 'a, 'd'], the value of "ordering" would be [1, 2, 0, 3].
        // This mapping is used because it is easy to translate to flexbox ordering,
        // the `order` property for item N is ordering.indexOf(N).
        // If the user-facing order matches props.items, the ordering is just [0, 1, 2, ...]
        let ordering = Array(this.props.items.length).fill(0)
            .map((_, i) => i);
        const isNumber = v => typeof v === 'number' && !isNaN(v);
        if (isNumber(draggingIndex) && isNumber(newIndex)) {
            ordering = ordering.slice(0, draggingIndex).concat(ordering.slice(draggingIndex + 1));
            ordering.splice(newIndex, 0, draggingIndex);
        }
        return ordering;
    }
    getMouseOverIndex () {
        // MouseOverIndex is the index that the current drag wants to place the
        // the dragging object. Obviously only exists if there is a drag (i.e. currentOffset).
        // NB: The logic here only works for a vertically sorted list.
        let mouseOverIndex = null;
        if (this.props.dragInfo.currentOffset) {
            for (let n = 0; n < this.boxes.length; n++) {
                const y = this.props.dragInfo.currentOffset.y;
                const box = this.boxes[n];
                const max = n === this.boxes.length - 1 ? Infinity : box.top + box.height;
                const min = n === 0 ? -Infinity : this.boxes[n - 1].top + this.boxes[n - 1].height;
                if (y > min && y <= max) {
                    mouseOverIndex = n;
                }
            }
        }
        return mouseOverIndex;
    }
    render () {
        const {dragInfo: {index: dragIndex}, items} = this.props;
        const mouseOverIndex = this.getMouseOverIndex();
        const ordering = this.getOrdering(items, dragIndex, mouseOverIndex);
        return (
            <SelectorComponent
                draggingIndex={dragIndex}
                mouseOverIndex={mouseOverIndex}
                ordering={ordering}
                onAddSortable={this.handleAddSortable}
                onRemoveSortable={this.handleRemoveSortable}
                {...this.props}
            />
        );
    }
}

Selector.propTypes = {
    dragInfo: PropTypes.shape({
        currentOffset: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        dragType: PropTypes.string,
        dragging: PropTypes.bool,
        index: PropTypes.number
    }),
    items: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        name: PropTypes.string.isRequired
    })),
    onClose: PropTypes.func,
    onDrop: PropTypes.func
};

const mapStateToProps = state => ({
    dragInfo: state.scratchGui.assetDrag,
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Selector);
