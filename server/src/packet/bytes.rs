pub fn to_f64(bytes: &[u8]) -> f64 {
    println!("{}", bytes.len());
    f64::from_ne_bytes(bytes.try_into().expect("slice with incorrect length"))
}
