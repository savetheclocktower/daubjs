# Functions
def make_incrementor(n):
    return lambda x, y, foo: x + n

# Parameters
def fct(x, y, z, *args, a=3, b = 5, **kwargs):
    print("{}".format(a))

# Imports
from foo import bar as baz

# Types
int("15") # → 15
integers = [int(x) for x in ('1','29','-3')] # → [1,29,-3]

# Escapes
b"toto\xfe\775" # byte string
r'abc\dev\''    # raw string
u'abc\\dev\\t'  # unicode string
