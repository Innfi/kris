use retry::{retry, delay::Fixed};

#[test]
fn test_retry() {
  let mut collection = vec![1, 2, 3].into_iter();

  let result = retry(Fixed::from_millis(1000).take(3), || {
      match collection.next() {
          Some(n) if n == 3 => Ok("n is 3!"),
          Some(_) => Err("n must be 3!"),
          None => Err("n was never 3!"),
      }
  });

  assert!(result.is_ok());
}