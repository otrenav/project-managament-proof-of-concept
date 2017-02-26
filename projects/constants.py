# -*- coding: utf-8 -*-

IN_PROGRESS = 1
SUBMITTED = 2
RECOMMENDED = 3
APPROVED = 4
DENIED = 5

PROGRESS_CHOICES = (
    (IN_PROGRESS, 'In progress'),
    (SUBMITTED, 'Submitted'),
    (RECOMMENDED, 'Recommended'),
    (APPROVED, 'Approved'),
    (DENIED, 'Denied'),
)

COMMENT = 1
SUBMIT = 2
RECOMMEND = 3
RETURN = 4
APPROVE = 5
DENY = 6

ACTION_CHOICES = (
    (COMMENT, 'Comment'),
    (SUBMIT, 'Submit'),
    (RECOMMEND, 'Recommend'),
    (RETURN, 'Return'),
    (APPROVE, 'Approve'),
    (DENY, 'Deny')
)
