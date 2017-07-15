### NOTE: This project is no longer under maintenance.

However, we will gladly accept new PRs or questions.

# a-pattern-restrict

Allowing certain inputs based on a regex pattern, preventing the user from inputting anything invalid.

This project is a sister of [ng-pattern-restrict](https://github.com/AlphaGit/ng-pattern-restrict/) (for Angular 1.x)

# What is this for?

It is possible that at some points you may want to restrict your user from entering certain values in your web application. Specifically, fields that conform to a very strict set of values. If you decide that it is a good idea for you to **restrict** what the user can even type in the input, this is the tool for you.

This works similar to a masked input, except that no mask is displayed, and the validation is done against a regular expression, which allows you to permit a complex class of values if that's what you need, or to be very specific if that is your necessity.

# How does it work?

The logic is quite simple:

- Initialization: save regex to be used from the `pattern` attribute (given that the `a-pattern-restrict` directive is present).
- Wait for user input, and reach on `input` (for any value change), `keyup` (for keyboard entry) or `click` (for text drag and drop, contextual copy-paste, etc).
- If the input matches the regex, save it as the latest valid value. Also save the current user's input caret position on the field.
- If the input does not match the regex, restore the latest valid value and set the user input caret in the same position as it was. The user experience should be as if nothing was typed or changed.

# Installation

Copy the [a-pattern-restrict.ts][srcfile] into your project, import the component and use it away.

# Usage

```html
<input type="text" pattern="[0-9]+" a-pattern-restrict />
```

## Notes:

- **Make sure to use "progressive" regular expressions.** The expressions are validated against the full regular expression. This means that if your regex is `\d\d`, and your textbox is empty, a user will never be able to type anything because the first keypress will not validate and will be reverted. Following the example, the proper regular expression should be `\d{0,2}`.
- **Your regex must validate against empty strings if you want users to be able to remove the value from the textbox.**

If you still have problems, please make sure to check the [Compatibility notes][compatibility]. There are several issues that really depend on the browsers.

## Version list

- [v0.2.2](https://github.com/AlphaGit/a-pattern-restrict/releases/tag/v0.2.2)

[compatibility]: docs/compatibility.md
[srcfile]: src/a-pattern-restrict.ts
