function ArraySort(comparefn) {
  if (IS_NULL_OR_UNDEFINED(this) && !IS_UNDETECTABLE(this)) {
    throw MakeTypeError("called_on_null_or_undefined", ["Array.prototype.sort"]);
  }

  // In-place QuickSort algorithm.
  // For short (length <= 22) arrays, insertion sort is used for efficiency.
  if (!IS_SPEC_FUNCTION(comparefn)) {
    comparefn = function(x, y) {
      if (x === y) return 0;
      if ( % _IsSmi(x) && % _IsSmi(y)) {
        return %SmiLexicographicCompare(x, y);
      }
      x = ToString(x);
      y = ToString(y);
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  var receiver = % GetDefaultReceiver(comparefn);

  var InsertionSort = function InsertionSort(a, from, to) {
      for (var i = from + 1; i < to; i++) {
        var element = a[i];
        for (var j = i - 1; j >= from; j--) {
          var tmp = a[j];
          var order = % _CallFunction(receiver, tmp, element, comparefn);
          if (order > 0) {
            a[j + 1] = tmp;
          } else {
            break;
          }
        }
        a[j + 1] = element;
      }
    };

  var GetThirdIndex = function(a, from, to) {
      var t_array = [];
      // Use both 'from' and 'to' to determine the pivot candidates.
      var increment = 200 + ((to - from) & 15);
      for (var i = from + 1; i < to - 1; i += increment) {
        t_array.push([i, a[i]]);
      }
      t_array.sort(function(a, b) {
        return %_CallFunction(receiver, a[1], b[1], comparefn)
      });
      var third_index = t_array[t_array.length >> 1][0];
      return third_index;
    }

  var QuickSort = function QuickSort(a, from, to) {
      var third_index = 0;
      while (true) {
        // Insertion sort is faster for short arrays.
        if (to - from <= 10) {
          InsertionSort(a, from, to);
          return;
        }
        if (to - from > 1000) {
          third_index = GetThirdIndex(a, from, to);
        } else {
          third_index = from + ((to - from) >> 1);
        }
        // Find a pivot as the median of first, last and middle element.
        var v0 = a[from];
        var v1 = a[to - 1];
        var v2 = a[third_index];
        var c01 = % _CallFunction(receiver, v0, v1, comparefn);
        if (c01 > 0) {
          // v1 < v0, so swap them.
          var tmp = v0;
          v0 = v1;
          v1 = tmp;
        } // v0 <= v1.
        var c02 = % _CallFunction(receiver, v0, v2, comparefn);
        if (c02 >= 0) {
          // v2 <= v0 <= v1.
          var tmp = v0;
          v0 = v2;
          v2 = v1;
          v1 = tmp;
        } else {
          // v0 <= v1 && v0 < v2
          var c12 = % _CallFunction(receiver, v1, v2, comparefn);
          if (c12 > 0) {
            // v0 <= v2 < v1
            var tmp = v1;
            v1 = v2;
            v2 = tmp;
          }
        }
        // v0 <= v1 <= v2
        a[from] = v0;
        a[to - 1] = v2;
        var pivot = v1;
        var low_end = from + 1; // Upper bound of elements lower than pivot.
        var high_start = to - 1; // Lower bound of elements greater than pivot.
        a[third_index] = a[low_end];
        a[low_end] = pivot;

        // From low_end to i are elements equal to pivot.
        // From i to high_start are elements that haven't been compared yet.
        partition: for (var i = low_end + 1; i < high_start; i++) {
          var element = a[i];
          var order = % _CallFunction(receiver, element, pivot, comparefn);
          if (order < 0) {
            a[i] = a[low_end];
            a[low_end] = element;
            low_end++;
          } else if (order > 0) {
            do {
              high_start--;
              if (high_start == i) break partition;
              var top_elem = a[high_start];
              order = % _CallFunction(receiver, top_elem, pivot, comparefn);
            } while (order > 0);
            a[i] = a[high_start];
            a[high_start] = element;
            if (order < 0) {
              element = a[i];
              a[i] = a[low_end];
              a[low_end] = element;
              low_end++;
            }
          }
        }
        if (to - high_start < low_end - from) {
          QuickSort(a, high_start, to);
          to = low_end;
        } else {
          QuickSort(a, from, low_end);
          from = high_start;
        }
      }
    };

  // Copy elements in the range 0..length from obj's prototype chain
  // to obj itself, if obj has holes. Return one more than the maximal index
  // of a prototype property.
  var CopyFromPrototype = function CopyFromPrototype(obj, length) {
      var max = 0;
      for (var proto = % GetPrototype(obj); proto; proto = % GetPrototype(proto)) {
        var indices = % GetArrayKeys(proto, length);
        if (IS_NUMBER(indices)) {
          // It's an interval.
          var proto_length = indices;
          for (var i = 0; i < proto_length; i++) {
            if (!obj.hasOwnProperty(i) && proto.hasOwnProperty(i)) {
              obj[i] = proto[i];
              if (i >= max) {
                max = i + 1;
              }
            }
          }
        } else {
          for (var i = 0; i < indices.length; i++) {
            var index = indices[i];
            if (!IS_UNDEFINED(index) && !obj.hasOwnProperty(index) && proto.hasOwnProperty(index)) {
              obj[index] = proto[index];
              if (index >= max) {
                max = index + 1;
              }
            }
          }
        }
      }
      return max;
    };

  // Set a value of "undefined" on all indices in the range from..to
  // where a prototype of obj has an element. I.e., shadow all prototype
  // elements in that range.
  var ShadowPrototypeElements = function(obj, from, to) {
      for (var proto = % GetPrototype(obj); proto; proto = % GetPrototype(proto)) {
        var indices = % GetArrayKeys(proto, to);
        if (IS_NUMBER(indices)) {
          // It's an interval.
          var proto_length = indices;
          for (var i = from; i < proto_length; i++) {
            if (proto.hasOwnProperty(i)) {
              obj[i] = void 0;
            }
          }
        } else {
          for (var i = 0; i < indices.length; i++) {
            var index = indices[i];
            if (!IS_UNDEFINED(index) && from <= index && proto.hasOwnProperty(index)) {
              obj[index] = void 0;
            }
          }
        }
      }
    };

  var SafeRemoveArrayHoles = function SafeRemoveArrayHoles(obj) {
      // Copy defined elements from the end to fill in all holes and undefineds
      // in the beginning of the array.  Write undefineds and holes at the end
      // after loop is finished.
      var first_undefined = 0;
      var last_defined = length - 1;
      var num_holes = 0;
      while (first_undefined < last_defined) {
        // Find first undefined element.
        while (first_undefined < last_defined && !IS_UNDEFINED(obj[first_undefined])) {
          first_undefined++;
        }
        // Maintain the invariant num_holes = the number of holes in the original
        // array with indices <= first_undefined or > last_defined.
        if (!obj.hasOwnProperty(first_undefined)) {
          num_holes++;
        }

        // Find last defined element.
        while (first_undefined < last_defined && IS_UNDEFINED(obj[last_defined])) {
          if (!obj.hasOwnProperty(last_defined)) {
            num_holes++;
          }
          last_defined--;
        }
        if (first_undefined < last_defined) {
          // Fill in hole or undefined.
          obj[first_undefined] = obj[last_defined];
          obj[last_defined] = void 0;
        }
      }
      // If there were any undefineds in the entire array, first_undefined
      // points to one past the last defined element.  Make this true if
      // there were no undefineds, as well, so that first_undefined == number
      // of defined elements.
      if (!IS_UNDEFINED(obj[first_undefined])) first_undefined++;
      // Fill in the undefineds and the holes.  There may be a hole where
      // an undefined should be and vice versa.
      var i;
      for (i = first_undefined; i < length - num_holes; i++) {
        obj[i] = void 0;
      }
      for (i = length - num_holes; i < length; i++) {
        // For compatability with Webkit, do not expose elements in the prototype.
        if (i in % GetPrototype(obj)) {
          obj[i] = void 0;
        } else {
          delete obj[i];
        }
      }

      // Return the number of defined elements.
      return first_undefined;
    };

  var length = TO_UINT32(this.length);
  if (length < 2) return this;

  var is_array = IS_ARRAY(this);
  var max_prototype_element;
  if (!is_array) {
    // For compatibility with JSC, we also sort elements inherited from
    // the prototype chain on non-Array objects.
    // We do this by copying them to this object and sorting only
    // local elements. This is not very efficient, but sorting with
    // inherited elements happens very, very rarely, if at all.
    // The specification allows "implementation dependent" behavior
    // if an element on the prototype chain has an element that
    // might interact with sorting.
    max_prototype_element = CopyFromPrototype(this, length);
  }

  var num_non_undefined = % IsObserved(this) ? -1 : % RemoveArrayHoles(this, length);

  if (num_non_undefined == -1) {
    // The array is observed, or there were indexed accessors in the array.
    // Move array holes and undefineds to the end using a Javascript function
    // that is safe in the presence of accessors and is observable.
    num_non_undefined = SafeRemoveArrayHoles(this);
  }

  QuickSort(this, 0, num_non_undefined);

  if (!is_array && (num_non_undefined + 1 < max_prototype_element)) {
    // For compatibility with JSC, we shadow any elements in the prototype
    // chain that has become exposed by sort moving a hole to its position.
    ShadowPrototypeElements(this, num_non_undefined, max_prototype_element);
  }

  return this;
}