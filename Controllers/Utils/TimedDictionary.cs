using System;
using System.Collections;
using System.Collections.Generic;
namespace FlightsFinder.Controllers
{
    class TimedDictionary<Key, Value> : IDictionary<Key, Value>
    {
        private int time;
        private Dictionary<Key, Value> items;
        private Dictionary<Key, DateTime> times;
        public TimedDictionary(int time)
        {
            this.time = time;
            items = new Dictionary<Key, Value>();
            times = new Dictionary<Key, DateTime>();
        }
        private void removeOld()
        {
            DateTime now = DateTime.Now;
            List<Key> keysToRemove = new List<Key>();
            foreach (var item in times)
            {
                if ((now - item.Value).TotalSeconds > time)
                {
                    keysToRemove.Add(item.Key);
                }
            }
            keysToRemove.ForEach(key => remove(key));
        }
        public void Add(Key key, Value value)
        {
            removeOld();
            if (key == null)
            {
                throw new ArgumentNullException();
            }
            if (items.ContainsKey(key))
            {
                throw new ArgumentException();
            }
            DateTime insertTime = DateTime.Now;
            items.Add(key, value);
            times.Add(key, insertTime);
        }
        public void Add(KeyValuePair<Key, Value> item)
        {
            Add(item.Key, item.Value);
        }
        public bool ContainsKey(Key key)
        {
            removeOld();
            return items.ContainsKey(key);
        }
        private bool remove(Key key)
        {
            times.Remove(key);
            return items.Remove(key);
        }
        public bool Remove(Key key)
        {
            removeOld();
            return remove(key);
        }
        public bool Remove(KeyValuePair<Key, Value> item)
        {
            return Remove(item.Key);
        }
        public bool TryGetValue(Key key, out Value value)
        {
            removeOld();
            return items.TryGetValue(key, out value);
        }
        public Value this[Key key]
        {
            get
            {
                Value value;
                bool isExists = TryGetValue(key, out value);
                if (!isExists)
                {
                    throw new KeyNotFoundException();
                }
                return value;
            }
            set
            {
                times[key] = DateTime.Now;
                items[key] = value;
            }
        }
        public ICollection<Key> Keys
        {
            get
            {
                removeOld();
                return items.Keys;
            }
        }
        public ICollection<Value> Values
        {
            get
            {
                removeOld();
                return items.Values;
            }
        }
        public int Count
        {
            get
            {
                removeOld();
                return items.Count;
            }
        }
        public bool IsReadOnly
        {
            get
            {
                return false;
            }
        }
        public void Clear()
        {
            items.Clear();
            times.Clear();
        }
        public bool Contains(KeyValuePair<Key, Value> item)
        {
            removeOld();
            return ((IDictionary<Key, Value>)items).Contains(item);
        }
        public void CopyTo(KeyValuePair<Key, Value>[] array, int arrayIndex)
        {
            removeOld();
            ((IDictionary<Key, Value>)items).CopyTo(array, arrayIndex);
        }
        IEnumerator<KeyValuePair<Key, Value>> IEnumerable<KeyValuePair<Key, Value>>.GetEnumerator()
        {
            removeOld();
            return items.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            removeOld();
            return items.GetEnumerator();
        }
    }
}