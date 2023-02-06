# Classes/modules
class Item < ActiveRecord::Base

  def do_something(foo, bar = :baz)
    puts `Thing! #{foo}`
  end

end

module Foo

  class << self
    def static_method(zort)
      puts zort
    end
  end

end


# Nested blocks
foo.map { |id|
  item.map { |wtf| "wtf#{id}" }
  "foo#{id}"
}

# Block parameters
troz.map do |bar, baz|
  zort << baz
  if something
    "something else"
  end
end

# Shell commands
foo = CGI::escape('foo')
$result = `do --something | with #{foo}`
